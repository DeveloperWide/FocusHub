const crypto = require("crypto");
const Promo = require("../models/Promo");
const BillingOrder = require("../models/BillingOrder");
const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const {
  getPlan,
  getPlanPriceRupees,
  getPublicPlans,
  getSubscriptionDays,
  isPaidPlan,
  normalizeInterval,
  normalizePlanId,
} = require("../utils/billingPlans");

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

const EARLY_BIRD_KEY = "earlyBird";
const EARLY_BIRD_LIMIT = Number(process.env.EARLY_BIRD_LIMIT || 1000);
const EARLY_BIRD_DISCOUNT_PERCENT = Number(
  process.env.EARLY_BIRD_DISCOUNT_PERCENT || 15,
);

const RESERVATION_TTL_MINUTES = Number(
  process.env.EARLY_BIRD_RESERVATION_TTL_MINUTES || 60,
);

const ensureEarlyBirdPromo = async () => {
  await Promo.updateOne(
    { key: EARLY_BIRD_KEY },
    {
      $setOnInsert: {
        key: EARLY_BIRD_KEY,
        active: true,
        limit: EARLY_BIRD_LIMIT,
        claimed: 0,
        reserved: 0,
        discountPercent: EARLY_BIRD_DISCOUNT_PERCENT,
      },
    },
    { upsert: true },
  );

  return Promo.findOne({ key: EARLY_BIRD_KEY });
};

const cleanupStaleReservations = async () => {
  const cutoff = new Date(Date.now() - RESERVATION_TTL_MINUTES * 60 * 1000);

  const staleOrders = await BillingOrder.find(
    {
      status: "created",
      earlyBirdReserved: true,
      createdAt: { $lt: cutoff },
    },
    { _id: 1 },
  ).limit(200);

  if (staleOrders.length === 0) return;

  const staleIds = staleOrders.map((o) => o._id);

  await BillingOrder.updateMany(
    { _id: { $in: staleIds } },
    { $set: { status: "failed", earlyBirdReserved: false, promoKey: null } },
  );

  const decrementBy = staleOrders.length;
  await Promo.updateOne(
    { key: EARLY_BIRD_KEY },
    [
      {
        $set: {
          reserved: {
            $max: [0, { $subtract: ["$reserved", decrementBy] }],
          },
        },
      },
    ],
  );
};

const requireBillingConfigured = () => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new ExpressError(
      501,
      "Billing is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    );
  }
};

const createRazorpayOrder = async ({ amount, currency, receipt, notes }) => {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString(
    "base64",
  );

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      json?.error?.description ||
      json?.message ||
      "Failed to create Razorpay order";
    throw new ExpressError(502, msg);
  }

  return json;
};

const safeCompare = (a, b) => {
  const bufA = Buffer.from(String(a || ""), "utf8");
  const bufB = Buffer.from(String(b || ""), "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

exports.getPlans = wrapAsync(async (req, res) => {
  await ensureEarlyBirdPromo();
  await cleanupStaleReservations();

  const promo = await Promo.findOne({ key: EARLY_BIRD_KEY });
  const remaining = promo ? promo.remaining() : 0;

  res.status(200).json({
    success: true,
    data: {
      plans: getPublicPlans(),
      promos: {
        earlyBird: promo
          ? {
              key: promo.key,
              active: promo.active,
              limit: promo.limit,
              claimed: promo.claimed,
              reserved: promo.reserved,
              remaining,
              discountPercent: promo.discountPercent,
            }
          : null,
      },
    },
  });
});

exports.createCheckout = wrapAsync(async (req, res) => {
  requireBillingConfigured();

  const planId = normalizePlanId(req.body?.planId);
  const interval = normalizeInterval(req.body?.interval);

  if (!isPaidPlan(planId)) {
    throw new ExpressError(400, "Invalid plan");
  }

  const plan = getPlan(planId);
  if (!plan) throw new ExpressError(400, "Invalid plan");

  const basePrice = getPlanPriceRupees(planId, interval);
  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    throw new ExpressError(400, "Invalid interval");
  }

  await ensureEarlyBirdPromo();
  await cleanupStaleReservations();

  const promo = await Promo.findOne({ key: EARLY_BIRD_KEY });

  let earlyBirdReserved = false;
  let discountPercent = 0;

  if (promo?.active) {
    const updated = await Promo.findOneAndUpdate(
      {
        key: EARLY_BIRD_KEY,
        active: true,
        $expr: {
          $lt: [{ $add: ["$claimed", "$reserved"] }, "$limit"],
        },
      },
      { $inc: { reserved: 1 } },
      { new: true },
    );

    if (updated) {
      earlyBirdReserved = true;
      discountPercent = Math.max(0, Math.min(90, Number(updated.discountPercent || 0)));
    }
  }

  const baseAmount = Math.round(basePrice * 100);
  const amount = earlyBirdReserved
    ? Math.max(100, Math.round((baseAmount * (100 - discountPercent)) / 100))
    : baseAmount;

  let order;
  try {
    order = await createRazorpayOrder({
      amount,
      currency: "INR",
      receipt: `fh_${req.user.id}_${Date.now()}`,
      notes: {
        planId,
        interval,
        userId: String(req.user.id),
        promo: earlyBirdReserved ? EARLY_BIRD_KEY : "",
      },
    });
  } catch (err) {
    if (earlyBirdReserved) {
      await Promo.updateOne(
        { key: EARLY_BIRD_KEY },
        [{ $set: { reserved: { $max: [0, { $subtract: ["$reserved", 1] }] } } }],
      );
    }
    throw err;
  }

  const orderDoc = new BillingOrder({
    user: req.user.id,
    planId,
    interval,
    currency: "INR",
    baseAmount,
    amount,
    promoKey: earlyBirdReserved ? EARLY_BIRD_KEY : null,
    earlyBirdReserved,
    razorpayOrderId: order.id,
    status: "created",
  });

  await orderDoc.save();

  res.status(200).json({
    success: true,
    data: {
      keyId: RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: {
        id: plan.id,
        name: plan.name,
      },
      interval,
      pricing: {
        baseAmount,
        amount,
        discountPercent: earlyBirdReserved ? discountPercent : 0,
        promoKey: earlyBirdReserved ? EARLY_BIRD_KEY : null,
      },
    },
  });
});

exports.verifyPayment = wrapAsync(async (req, res) => {
  requireBillingConfigured();

  const orderId = String(req.body?.razorpay_order_id || "").trim();
  const paymentId = String(req.body?.razorpay_payment_id || "").trim();
  const signature = String(req.body?.razorpay_signature || "").trim();

  if (!orderId || !paymentId || !signature) {
    throw new ExpressError(400, "Missing payment verification fields");
  }

  const orderDoc = await BillingOrder.findOne({
    razorpayOrderId: orderId,
    user: req.user.id,
  });
  if (!orderDoc) throw new ExpressError(404, "Order not found");

  if (orderDoc.status === "paid") {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      message: "Already verified",
      data: { subscription: user?.subscription || null },
    });
  }

  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const ok = safeCompare(expected, signature);

  if (!ok) {
    orderDoc.status = "failed";
    orderDoc.razorpayPaymentId = paymentId;
    orderDoc.razorpaySignature = signature;
    await orderDoc.save();

    if (orderDoc.earlyBirdReserved) {
      await Promo.updateOne(
        { key: EARLY_BIRD_KEY },
        [{ $set: { reserved: { $max: [0, { $subtract: ["$reserved", 1] }] } } }],
      );
      orderDoc.earlyBirdReserved = false;
      orderDoc.promoKey = null;
      await orderDoc.save();
    }

    throw new ExpressError(400, "Payment verification failed");
  }

  orderDoc.status = "paid";
  orderDoc.razorpayPaymentId = paymentId;
  orderDoc.razorpaySignature = signature;
  orderDoc.paidAt = new Date();
  await orderDoc.save();

  if (orderDoc.earlyBirdReserved) {
    await Promo.updateOne(
      { key: EARLY_BIRD_KEY },
      [
        {
          $set: {
            reserved: { $max: [0, { $subtract: ["$reserved", 1] }] },
            claimed: { $add: ["$claimed", 1] },
          },
        },
      ],
    );
    orderDoc.earlyBirdReserved = false;
    await orderDoc.save();
  }

  const days = getSubscriptionDays(orderDoc.interval);
  if (!days) throw new ExpressError(400, "Invalid subscription interval");

  const now = new Date();
  const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const plan = getPlan(orderDoc.planId);
  if (!plan) throw new ExpressError(400, "Invalid subscription plan");

  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError(404, "User not found");

  user.subscription = {
    planId: orderDoc.planId,
    interval: orderDoc.interval,
    status: "active",
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: false,
    razorpay: {
      lastOrderId: orderId,
      lastPaymentId: paymentId,
    },
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscription activated",
    data: {
      subscription: user.subscription,
    },
  });
});


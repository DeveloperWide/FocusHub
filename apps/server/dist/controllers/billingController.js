"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createCheckout = exports.getPlans = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Promo_1 = __importDefault(require("../models/Promo"));
const Payment_1 = __importDefault(require("../models/Payment"));
const User_1 = __importDefault(require("../models/User"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
const billingPlans_1 = require("../utils/billingPlans");
const constant_1 = require("../constants/constant");
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const EARLY_BIRD_KEY = "earlyBird";
const EARLY_BIRD_LIMIT = Number(process.env.EARLY_BIRD_LIMIT);
const EARLY_BIRD_DISCOUNT_PERCENT = Number(process.env.EARLY_BIRD_DISCOUNT_PERCENT);
const RESERVATION_TTL_MINUTES = Number(process.env.EARLY_BIRD_RESERVATION_TTL_MINUTES);
const ensureEarlyBirdPromo = async () => {
    await Promo_1.default.updateOne({ key: EARLY_BIRD_KEY }, {
        $setOnInsert: {
            key: EARLY_BIRD_KEY,
            active: true,
            limit: EARLY_BIRD_LIMIT,
            claimed: 0,
            reserved: 0,
            discountPercent: EARLY_BIRD_DISCOUNT_PERCENT,
        },
    }, { upsert: true });
    return Promo_1.default.findOne({ key: EARLY_BIRD_KEY });
};
const cleanupStaleReservations = async () => {
    const cutoff = new Date(Date.now() - RESERVATION_TTL_MINUTES * 60 * 1000);
    const staleOrders = await Payment_1.default.find({
        status: "created",
        earlyBirdReserved: true,
        createdAt: { $lt: cutoff },
    }, { _id: 1 }).limit(200);
    if (staleOrders.length === 0)
        return;
    const staleIds = staleOrders.map((o) => o._id);
    await Payment_1.default.updateMany({ _id: { $in: staleIds } }, { $set: { status: "failed", earlyBirdReserved: false, promoKey: null } });
    const decrementBy = staleOrders.length;
    await Promo_1.default.updateOne({ key: EARLY_BIRD_KEY }, [
        {
            $set: {
                reserved: {
                    $max: [0, { $subtract: ["$reserved", decrementBy] }],
                },
            },
        },
    ]);
};
const requireBillingConfigured = () => {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new ExpressError_1.default(501, "Billing is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    }
};
const createRazorpayOrder = async ({ amount, currency, receipt, notes, }) => {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
    const res = await fetch(`${constant_1.RAZORPAY_BASE_URL}/v1/orders`, {
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
        const msg = json?.error?.description ||
            json?.message ||
            "Failed to create Razorpay order";
        throw new ExpressError_1.default(502, msg);
    }
    return json;
};
const safeCompare = (a, b) => {
    const bufA = Buffer.from(String(a ?? ""), "utf8");
    const bufB = Buffer.from(String(b ?? ""), "utf8");
    if (bufA.length !== bufB.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(bufA, bufB);
};
exports.getPlans = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    await ensureEarlyBirdPromo();
    await cleanupStaleReservations();
    const promo = await Promo_1.default.findOne({ key: EARLY_BIRD_KEY });
    const remaining = promo ? promo.remaining() : 0;
    res.status(200).json({
        success: true,
        data: {
            plans: (0, billingPlans_1.getPublicPlans)(),
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
exports.createCheckout = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    requireBillingConfigured();
    const planId = (0, billingPlans_1.normalizePlanId)(req.body?.planId);
    const interval = (0, billingPlans_1.normalizeInterval)(req.body?.interval);
    if (!(0, billingPlans_1.isPaidPlan)(planId)) {
        throw new ExpressError_1.default(400, "Invalid plan");
    }
    const plan = (0, billingPlans_1.getPlan)(planId);
    if (!plan)
        throw new ExpressError_1.default(400, "Invalid plan");
    const basePrice = (0, billingPlans_1.getPlanPriceRupees)(planId, interval);
    if (!Number.isFinite(basePrice) || basePrice <= 0) {
        throw new ExpressError_1.default(400, "Invalid interval");
    }
    await ensureEarlyBirdPromo();
    await cleanupStaleReservations();
    const promo = await Promo_1.default.findOne({ key: EARLY_BIRD_KEY });
    let earlyBirdReserved = false;
    let discountPercent = 0;
    if (promo?.active) {
        const updated = await Promo_1.default.findOneAndUpdate({
            key: EARLY_BIRD_KEY,
            active: true,
            $expr: {
                $lt: [{ $add: ["$claimed", "$reserved"] }, "$limit"],
            },
        }, { $inc: { reserved: 1 } }, { new: true });
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
            receipt: `fh_${Math.random().toString(36).slice(2, 10)}`,
            notes: {
                planId,
                interval,
                userId: String(req.user?.id),
                promo: earlyBirdReserved ? EARLY_BIRD_KEY : "",
            },
        });
    }
    catch (err) {
        if (earlyBirdReserved) {
            await Promo_1.default.updateOne({ key: EARLY_BIRD_KEY }, [
                { $set: { reserved: { $max: [0, { $subtract: ["$reserved", 1] }] } } },
            ]);
        }
        throw err;
    }
    const orderDoc = new Payment_1.default({
        user: req.user?.id,
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
exports.verifyPayment = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    requireBillingConfigured();
    const orderId = String(req.body?.razorpay_order_id || "").trim();
    const paymentId = String(req.body?.razorpay_payment_id || "").trim();
    const signature = String(req.body?.razorpay_signature || "").trim();
    if (!orderId || !paymentId || !signature) {
        throw new ExpressError_1.default(400, "Missing payment verification fields");
    }
    const orderDoc = await Payment_1.default.findOne({
        razorpayOrderId: orderId,
        user: req.user?.id,
    });
    if (!orderDoc)
        throw new ExpressError_1.default(404, "Order not found");
    if (orderDoc.status === "paid") {
        const user = await User_1.default.findById(req.user?.id);
        return res.status(200).json({
            success: true,
            message: "Already verified",
            data: { subscription: user?.subscription || null },
        });
    }
    if (!RAZORPAY_KEY_SECRET)
        throw new ExpressError_1.default(500, "Something Went Wrong");
    const expected = crypto_1.default
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
            await Promo_1.default.updateOne({ key: EARLY_BIRD_KEY }, [
                { $set: { reserved: { $max: [0, { $subtract: ["$reserved", 1] }] } } },
            ]);
            orderDoc.earlyBirdReserved = false;
            orderDoc.promoKey = "";
            await orderDoc.save();
        }
        throw new ExpressError_1.default(400, "Payment verification failed");
    }
    orderDoc.status = "paid";
    orderDoc.razorpayPaymentId = paymentId;
    orderDoc.razorpaySignature = signature;
    orderDoc.paidAt = new Date();
    await orderDoc.save();
    if (orderDoc.earlyBirdReserved) {
        await Promo_1.default.updateOne({ key: EARLY_BIRD_KEY }, [
            {
                $set: {
                    reserved: { $max: [0, { $subtract: ["$reserved", 1] }] },
                    claimed: { $add: ["$claimed", 1] },
                },
            },
        ]);
        orderDoc.earlyBirdReserved = false;
        await orderDoc.save();
    }
    const days = (0, billingPlans_1.getSubscriptionDays)(orderDoc.interval);
    if (!days)
        throw new ExpressError_1.default(400, "Invalid subscription interval");
    const now = new Date();
    const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const plan = (0, billingPlans_1.getPlan)(orderDoc.planId);
    if (!plan)
        throw new ExpressError_1.default(400, "Invalid subscription plan");
    const user = await User_1.default.findById(req.user?.id);
    if (!user)
        throw new ExpressError_1.default(404, "User not found");
    user.subscription = {
        planId: orderDoc.planId,
        interval: orderDoc.interval,
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        subscriptionId: "",
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

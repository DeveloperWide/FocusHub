import crypto from "crypto";
import { wrapAsync } from "../utils/asyncWrapper";
import {
  isInterval,
  isPaidPlan,
  normalizeInterval,
  normalizePlanId,
} from "../utils/billingPlans";
import ExpressError from "../utils/ExpressError";
import { createSubscription } from "../services/subscriptionService";
import Subscription, { ISubscription } from "../models/Subscription";
import User from "../models/User";
import { syncUserSubscription } from "../utils/subscriptionSync";

interface RazorpaySubscriptionEntity {
  id?: string;
  status?: string;
  current_start?: number;
  current_end?: number;
  ended_at?: number;
  cancelled_at?: number;
  cancel_at_cycle_end?: boolean;
}

interface RazorpayWebhookPayload {
  event?: string;
  created_at?: number;
  payload?: {
    subscription?: {
      entity?: RazorpaySubscriptionEntity;
    };
  };
}

const safeCompare = (expected: string, received: string): boolean => {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
};

const toDate = (seconds: unknown): Date | null => {
  const value = Number(seconds);
  return Number.isFinite(value) && value > 0 ? new Date(value * 1000) : null;
};

const mapRazorpayStatus = (
  status: unknown,
): ISubscription["status"] | null => {
  const normalized = String(status || "").toLowerCase();
  const validStatuses: ISubscription["status"][] = [
    "created",
    "authenticated",
    "active",
    "pending",
    "halted",
    "cancelled",
    "completed",
    "paused",
    "expired",
  ];

  return validStatuses.includes(normalized as ISubscription["status"])
    ? (normalized as ISubscription["status"])
    : null;
};

const syncUserForSubscription = async (subscription: ISubscription) => {
  const user = await User.findById(subscription.user);
  if (!user) return false;

  syncUserSubscription(user, subscription);
  await user.save();
  return true;
};

export const createSubscriptionCheckout = wrapAsync(async (req, res) => {
  const planId = normalizePlanId(req.body?.planId);
  const interval = normalizeInterval(req.body?.interval);

  if (!isPaidPlan(planId)) throw new ExpressError(400, "Invalid paid plan");
  if (!isInterval(interval)) {
    throw new ExpressError(400, "Invalid billing interval");
  }
  if (!req.user?.id) throw new ExpressError(401, "Unauthorized");

  const result = await createSubscription({
    userId: String(req.user.id),
    planId,
    interval,
  });

  res.status(201).json({
    success: true,
    data: {
      subscriptionId: result.subscription._id,
      razorpaySubscriptionId: result.subscription.razorpaySubscriptionId,
      planId: result.subscription.planId,
      interval: result.subscription.interval,
      checkout: {
        keyId: process.env.RAZORPAY_KEY_ID,
        subscriptionId: result.subscription.razorpaySubscriptionId,
      },
    },
  });
});

export const verifySubscription = wrapAsync(async (req, res) => {
  const paymentId = String(req.body?.razorpay_payment_id || "").trim();
  const razorpaySubscriptionId = String(
    req.body?.razorpay_subscription_id || "",
  ).trim();
  const signature = String(req.body?.razorpay_signature || "").trim();

  if (!paymentId || !razorpaySubscriptionId || !signature) {
    throw new ExpressError(400, "Missing subscription verification fields");
  }

  const subscription = await Subscription.findOne({
    razorpaySubscriptionId,
    user: req.user?.id,
  });
  if (!subscription) throw new ExpressError(404, "Subscription not found");

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new ExpressError(500, "Subscription verification is not configured");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${paymentId}|${razorpaySubscriptionId}`)
    .digest("hex");

  if (!safeCompare(expectedSignature, signature)) {
    throw new ExpressError(400, "Subscription verification failed");
  }

  if (subscription.status === "created") {
    subscription.status = "authenticated";
    await subscription.save();
  }
  await syncUserForSubscription(subscription);

  res.status(200).json({
    success: true,
    message:
      "Payment verified. Subscription activation will be synchronized by Razorpay.",
    data: {
      subscriptionId: subscription._id,
      razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    },
  });
});

export const razorpayWebhook = wrapAsync(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) throw new ExpressError(500, "Webhook is not configured");

  const signature = String(req.headers["x-razorpay-signature"] || "").trim();
  if (!signature) {
    throw new ExpressError(400, "Missing Razorpay webhook signature");
  }
  if (!Buffer.isBuffer(req.body)) {
    throw new ExpressError(400, "Webhook body must be raw bytes");
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");
  if (!safeCompare(expectedSignature, signature)) {
    throw new ExpressError(400, "Invalid webhook signature");
  }

  let payload: RazorpayWebhookPayload;
  try {
    payload = JSON.parse(req.body.toString("utf8"));
  } catch {
    throw new ExpressError(400, "Invalid webhook payload");
  }

  const event = String(payload?.event || "");
  const razorpaySubscription = payload?.payload?.subscription?.entity;
  const razorpaySubscriptionId = String(razorpaySubscription?.id || "");
  if (!event || !razorpaySubscription || !razorpaySubscriptionId) {
    throw new ExpressError(400, "Invalid Razorpay webhook payload");
  }

  const subscription = await Subscription.findOne({ razorpaySubscriptionId });
  if (!subscription) {
    return res
      .status(200)
      .json({ success: true, message: "Unknown subscription ignored" });
  }

  const eventAt = toDate(payload?.created_at);
  if (eventAt && subscription.lastEventAt && eventAt <= subscription.lastEventAt) {
    return res
      .status(200)
      .json({ success: true, message: "Duplicate or older event ignored" });
  }

  const periodStart = toDate(razorpaySubscription.current_start);
  const periodEnd = toDate(razorpaySubscription.current_end);
  const endedAt = toDate(razorpaySubscription.ended_at);
  const cancelledAt = toDate(razorpaySubscription.cancelled_at);

  if (periodStart) subscription.currentPeriodStart = periodStart;
  if (periodEnd) subscription.currentPeriodEnd = periodEnd;
  if (endedAt) subscription.endedAt = endedAt;
  if (cancelledAt) subscription.cancelledAt = cancelledAt;
  if (typeof razorpaySubscription.cancel_at_cycle_end === "boolean") {
    subscription.cancelAtPeriodEnd = razorpaySubscription.cancel_at_cycle_end;
  }

  const eventStatusByEvent: Record<string, ISubscription["status"]> = {
    "subscription.authenticated": "authenticated",
    "subscription.activated": "active",
    "subscription.charged": "active",
    "subscription.resumed": "active",
    "subscription.paused": "paused",
    "subscription.pending": "pending",
    "subscription.halted": "halted",
    "subscription.cancelled": "cancelled",
    "subscription.completed": "completed",
  };

  subscription.status =
    eventStatusByEvent[event] ||
    mapRazorpayStatus(razorpaySubscription.status) ||
    subscription.status;
  subscription.lastEventAt = eventAt || subscription.lastEventAt;
  await subscription.save();
  await syncUserForSubscription(subscription);

  return res.status(200).json({ success: true, message: "Webhook processed" });
});

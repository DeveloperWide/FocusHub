import crypto from "crypto";
import { Request, Response } from "express";
import { wrapAsync } from "../utils/asyncWrapper";
import {
  isInterval,
  isPaidPlan,
  normalizeInterval,
  normalizePlanId,
} from "../utils/billingPlans";
import ExpressError from "../utils/ExpressError";
import { createSubscription } from "../services/subscriptionService";
import Subscription from "../models/Subscription";

const safeCompare = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
};

export const createSubscriptionCheckout = wrapAsync(async (req, res) => {
  const planId = normalizePlanId(req.body?.planId);
  const interval = normalizeInterval(req.body?.interval);

  if (!isPaidPlan(planId)) {
    throw new ExpressError(400, "Invalid paid plan");
  }

  if (!isInterval(interval)) {
    throw new ExpressError(400, "Invalid billing interval");
  }

  if (!req.user?.id) {
    throw new ExpressError(401, "Unauthorized");
  }

  const result = await createSubscription({
    userId: String(req.user.id),
    planId,
    interval,
  });

  if (!result) throw new ExpressError(500, "Internal Server Error");

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

  if (!subscription) {
    throw new ExpressError(404, "Subscription not found");
  }

  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpayKeySecret) {
    throw new ExpressError(500, "Subscription verification is not configured");
  }

  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${paymentId}|${razorpaySubscriptionId}`)
    .digest("hex");

  const isValid = safeCompare(expectedSignature, signature);

  if (!isValid) {
    throw new ExpressError(400, "Subscription verification failed");
  }

  subscription.status = "authenticated";

  await subscription.save();

  return res.status(200).json({
    success: true,
    message: "Subscription payment verified",
    data: {
      subscriptionId: subscription._id,
      razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      status: subscription.status,
    },
  });
});

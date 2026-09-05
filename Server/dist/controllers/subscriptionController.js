"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = exports.verifySubscription = exports.createSubscriptionCheckout = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.createSubscriptionCheckout = void 0;
const asyncWrapper_1 = require("../utils/asyncWrapper");
const billingPlans_1 = require("../utils/billingPlans");
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
const subscriptionService_1 = require("../services/subscriptionService");
const Subscription_1 = __importDefault(require("../models/Subscription"));
const User_1 = __importDefault(require("../models/User"));
const subscriptionSync_1 = require("../utils/subscriptionSync");
const safeCompare = (expected, received) => {
    const expectedBuffer = Buffer.from(expected, "utf8");
    const receivedBuffer = Buffer.from(received, "utf8");
    return (expectedBuffer.length === receivedBuffer.length &&
        crypto_1.default.timingSafeEqual(expectedBuffer, receivedBuffer));
};
const toDate = (seconds) => {
    const value = Number(seconds);
    return Number.isFinite(value) && value > 0 ? new Date(value * 1000) : null;
};
const mapRazorpayStatus = (status) => {
    const normalized = String(status || "").toLowerCase();
    const validStatuses = [
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
    return validStatuses.includes(normalized)
        ? normalized
        : null;
};
const syncUserForSubscription = async (subscription) => {
    const user = await User_1.default.findById(subscription.user);
    if (!user)
        return false;
    (0, subscriptionSync_1.syncUserSubscription)(user, subscription);
    await user.save();
    return true;
};
exports.createSubscriptionCheckout = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    const planId = (0, billingPlans_1.normalizePlanId)(req.body?.planId);
    const interval = (0, billingPlans_1.normalizeInterval)(req.body?.interval);
    if (!(0, billingPlans_1.isPaidPlan)(planId))
        throw new ExpressError_1.default(400, "Invalid paid plan");
    if (!(0, billingPlans_1.isInterval)(interval)) {
        throw new ExpressError_1.default(400, "Invalid billing interval");
    }
    if (!req.user?.id)
        throw new ExpressError_1.default(401, "Unauthorized");
exports.createSubscriptionCheckout = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    const planId = (0, billingPlans_1.normalizePlanId)(req.body?.planId);
    const interval = (0, billingPlans_1.normalizeInterval)(req.body?.interval);
    if (!(0, billingPlans_1.isPaidPlan)(planId)) {
        throw new ExpressError_1.default(400, "Invalid paid plan");
    }
    if (!(0, billingPlans_1.isInterval)(interval)) {
        throw new ExpressError_1.default(400, "Invalid billing interval");
    }
    if (!req.user?.id) {
        throw new ExpressError_1.default(401, "Unauthorized");
    }
    const result = await (0, subscriptionService_1.createSubscription)({
        userId: String(req.user.id),
        planId,
        interval,
    });
    if (!result)
        throw new ExpressError_1.default(500, "Internal Server Error");
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
exports.verifySubscription = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    const paymentId = String(req.body?.razorpay_payment_id || "").trim();
    const razorpaySubscriptionId = String(req.body?.razorpay_subscription_id || "").trim();
    const signature = String(req.body?.razorpay_signature || "").trim();
    if (!paymentId || !razorpaySubscriptionId || !signature) {
        throw new ExpressError_1.default(400, "Missing subscription verification fields");
    }
    const subscription = await Subscription_1.default.findOne({
        razorpaySubscriptionId,
        user: req.user?.id,
    });
    if (!subscription)
        throw new ExpressError_1.default(404, "Subscription not found");
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        throw new ExpressError_1.default(500, "Subscription verification is not configured");
    }
    const expectedSignature = crypto_1.default
        .createHmac("sha256", secret)
        .update(`${paymentId}|${razorpaySubscriptionId}`)
        .digest("hex");
    if (!safeCompare(expectedSignature, signature)) {
        throw new ExpressError_1.default(400, "Subscription verification failed");
    }
    if (subscription.status === "created") {
        subscription.status = "authenticated";
        await subscription.save();
    }
    await syncUserForSubscription(subscription);
    res.status(200).json({
        success: true,
        message: "Payment verified. Subscription activation will be synchronized by Razorpay.",
        data: {
            subscriptionId: subscription._id,
            razorpaySubscriptionId: subscription.razorpaySubscriptionId,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
        },
    });
});
exports.razorpayWebhook = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret)
        throw new ExpressError_1.default(500, "Webhook is not configured");
    const signature = String(req.headers["x-razorpay-signature"] || "").trim();
    if (!signature) {
        throw new ExpressError_1.default(400, "Missing Razorpay webhook signature");
    }
    if (!Buffer.isBuffer(req.body)) {
        throw new ExpressError_1.default(400, "Webhook body must be raw bytes");
    }
    const expectedSignature = crypto_1.default
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");
    if (!safeCompare(expectedSignature, signature)) {
        throw new ExpressError_1.default(400, "Invalid webhook signature");
    }
    let payload;
    try {
        payload = JSON.parse(req.body.toString("utf8"));
    }
    catch {
        throw new ExpressError_1.default(400, "Invalid webhook payload");
    }
    const event = String(payload?.event || "");
    const razorpaySubscription = payload?.payload?.subscription?.entity;
    const razorpaySubscriptionId = String(razorpaySubscription?.id || "");
    if (!event || !razorpaySubscription || !razorpaySubscriptionId) {
        throw new ExpressError_1.default(400, "Invalid Razorpay webhook payload");
    }
    const subscription = await Subscription_1.default.findOne({ razorpaySubscriptionId });
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
    if (periodStart)
        subscription.currentPeriodStart = periodStart;
    if (periodEnd)
        subscription.currentPeriodEnd = periodEnd;
    if (endedAt)
        subscription.endedAt = endedAt;
    if (cancelledAt)
        subscription.cancelledAt = cancelledAt;
    if (typeof razorpaySubscription.cancel_at_cycle_end === "boolean") {
        subscription.cancelAtPeriodEnd = razorpaySubscription.cancel_at_cycle_end;
    }
    const eventStatusByEvent = {
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

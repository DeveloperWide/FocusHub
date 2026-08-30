"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionCheckout = void 0;
const asyncWrapper_1 = require("../utils/asyncWrapper");
const billingPlans_1 = require("../utils/billingPlans");
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
const subscriptionService_1 = require("../services/subscriptionService");
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

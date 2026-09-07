"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscription = void 0;
const Subscription_1 = __importDefault(require("../models/Subscription"));
const razorpay_1 = __importDefault(require("./razorpay"));
const billingPlans_1 = require("../utils/billingPlans");
const createSubscription = async ({ userId, planId, interval, }) => {
    try {
        const razorpayPlanId = (0, billingPlans_1.getRazorpayPlanId)(planId, interval);
        if (!razorpayPlanId) {
            throw new Error("Razorpay Plan in not configured");
        }
        const existingSubscription = await Subscription_1.default.findOne({
            user: userId,
            $or: [
                {
                    status: {
                        $in: ["created", "authenticated", "pending", "halted", "paused"],
                    },
                },
                {
                    status: { $in: ["active", "cancelled"] },
                    currentPeriodEnd: { $gt: new Date() },
                },
            ],
        });
        if (existingSubscription) {
            throw new Error("User already have an Active or Pending Subscription");
        }
        const razorpaySubscription = await razorpay_1.default.subscriptions.create({
            plan_id: razorpayPlanId,
            total_count: 100,
            customer_notify: 1,
        });
        const subscription = await Subscription_1.default.create({
            user: userId,
            planId,
            interval,
            razorpaySubscriptionId: razorpaySubscription.id,
            razorpayPlanId,
            status: razorpaySubscription.status,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false,
        });
        return {
            subscription,
            razorpaySubscription,
        };
    }
    catch (err) {
        console.error("Subscription creation failed", err);
        throw err;
    }
};
exports.createSubscription = createSubscription;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserSubscription = exports.hasSubscriptionAccess = void 0;
const subscriptionStatus_1 = require("./subscriptionStatus");
const hasSubscriptionAccess = (subscription) => {
    const end = subscription.currentPeriodEnd?.getTime();
    return ((subscription.status === "active" || subscription.status === "cancelled") &&
        Number.isFinite(end) &&
        end > Date.now());
};
exports.hasSubscriptionAccess = hasSubscriptionAccess;
const syncUserSubscription = (user, subscription) => {
    const hasAccess = (0, exports.hasSubscriptionAccess)(subscription);
    const lifecycleStatus = (0, subscriptionStatus_1.getUserSubscriptionStatus)(subscription.status);
    user.subscription = {
        planId: hasAccess ? subscription.planId : "free",
        interval: hasAccess ? subscription.interval : null,
        status: hasAccess ? lifecycleStatus : lifecycleStatus === "expired" ? "expired" : "free",
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        subscriptionId: subscription.razorpaySubscriptionId,
    };
};
exports.syncUserSubscription = syncUserSubscription;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSubscriptionStatus = void 0;
const getUserSubscriptionStatus = (subscriptionStatus) => {
    switch (String(subscriptionStatus || "").toLowerCase()) {
        case "active":
            return "active";
        case "cancelled":
            return "cancelled";
        case "completed":
        case "expired":
            return "expired";
        default:
            return "free";
    }
};
exports.getUserSubscriptionStatus = getUserSubscriptionStatus;

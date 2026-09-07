export type UserSubscriptionStatus =
    | "free"
    | "expired"
    | "active"
    | "cancelled";

export const getUserSubscriptionStatus = (
    subscriptionStatus: string,
): UserSubscriptionStatus => {
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
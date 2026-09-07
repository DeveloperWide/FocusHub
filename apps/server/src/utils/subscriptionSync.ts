import { IUser } from "../models/User";
import { ISubscription } from "../models/Subscription";
import { getUserSubscriptionStatus } from "./subscriptionStatus";

export const hasSubscriptionAccess = (subscription: Pick<
  ISubscription,
  "status" | "currentPeriodEnd"
>): boolean => {
  const end = subscription.currentPeriodEnd?.getTime();
  return (
    (subscription.status === "active" || subscription.status === "cancelled") &&
    Number.isFinite(end) &&
    end! > Date.now()
  );
};

export const syncUserSubscription = (
  user: IUser,
  subscription: ISubscription,
): void => {
  const hasAccess = hasSubscriptionAccess(subscription);
  const lifecycleStatus = getUserSubscriptionStatus(subscription.status);

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
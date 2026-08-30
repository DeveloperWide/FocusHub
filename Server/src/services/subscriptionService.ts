import Subscription from "../models/Subscription";
import razorpay from "./razorpay";
import {
  getRazorpayPlanId,
  Interval,
  PaidPlanKey,
} from "../utils/billingPlans";

interface createSubscriptionParams {
  userId: string;
  planId: PaidPlanKey;
  interval: Interval;
}

export const createSubscription = async ({
  userId,
  planId,
  interval,
}: createSubscriptionParams) => {
  try {
    const razorpayPlanId = getRazorpayPlanId(planId, interval);

    if (!razorpayPlanId) {
      throw new Error("Razorpay Plan in not configured");
    }

    const existingSubscription = await Subscription.findOne({
      user: userId,
      status: {
        $in: ["created", "authenticated", "active", "pending", "halted"],
      },
    });

    if (existingSubscription) {
      throw new Error("User already have an Active or Pending Subscription");
    }

    const razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: 100,
      customer_notify: 1,
    });

    const subscription = await Subscription.create({
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
  } catch (err) {
    console.log(err);
    console.log("subscription Creation Failed");
  }
};

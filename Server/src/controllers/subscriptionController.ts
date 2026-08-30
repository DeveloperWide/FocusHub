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

export const createSubscriptionCheckout = wrapAsync(
  async (req: Request, res: Response) => {
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
  },
);

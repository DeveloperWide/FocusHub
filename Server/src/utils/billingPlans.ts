import { IUser } from "../models/User";
import { RAZORPAY_PLAN_IDS } from "./razorpayPlans";

export const BILLING_PLANS = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Explore FocusHub",

    prices: {
      monthly: 0,
      yearly: 0,
    },

    limits: {
      goals: 3,
      tasks: {
        high: 1,
        medium: 2,
        low: 3,
      },
    },
  },

  basic: {
    id: "basic",
    name: "Basic",
    tagline: "More room to plan",

    prices: {
      monthly: 99,
      yearly: 999,
    },

    limits: {
      goals: 5,
      tasks: {
        high: 2,
        medium: 4,
        low: 6,
      },
    },
  },

  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Best value for builders",

    prices: {
      monthly: 149,
      yearly: 1499,
    },

    limits: {
      goals: 10,
      tasks: {
        high: 4,
        medium: 8,
        low: 12,
      },
    },
  },

  elite: {
    id: "elite",
    name: "Elite",
    tagline: "Unlimited + early access",

    prices: {
      monthly: 199,
      yearly: 1999,
    },

    limits: {
      goals: 30,
      tasks: {
        high: 30,
        medium: 30,
        low: 30,
      },
    },
  },
} as const;

export const PLAN_ORDER = ["free", "basic", "pro", "elite"] as const;

export const PAID_PLANS = ["basic", "pro", "elite"] as const;

export const VALID_INTERVALS = ["monthly", "yearly"] as const;

export type Interval = (typeof VALID_INTERVALS)[number];

export type PlanKey = keyof typeof BILLING_PLANS;
export type PaidPlanKey = (typeof PAID_PLANS)[number];

export const normalizePlanId = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const isPlanKey = (key: string): key is PlanKey => {
  return Object.prototype.hasOwnProperty.call(BILLING_PLANS, key);
};

export const normalizeInterval = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const isInterval = (value: string): value is Interval => {
  return VALID_INTERVALS.includes(value as Interval);
};

export const getPlan = (planId: string) => {
  const key = normalizePlanId(planId); // " PRO " , "pro"

  if (!isPlanKey(key)) {
    return null;
  }

  return BILLING_PLANS[key];
};

export const isPaidPlan = (
  planId: string,
): planId is (typeof PAID_PLANS)[number] => {
  return PAID_PLANS.includes(normalizePlanId(planId) as PaidPlanKey);
};

export const getPublicPlans = () => {
  return PLAN_ORDER.map((id) => {
    const plan = BILLING_PLANS[id];

    return {
      id: plan.id,
      name: plan.name,
      tagline: plan.tagline,
      prices: plan.prices,
      limits: plan.limits,
    };
  });
};

export const getPlanPriceRupees = (
  planId: string,
  interval: string,
): number => {
  const plan = getPlan(planId);
  const normalizedInterval = normalizeInterval(interval);

  if (!plan || !isInterval(normalizedInterval)) {
    return 0;
  }

  return plan.prices[normalizedInterval];
};

export const getRazorpayPlanId = (
  planId: string,
  interval: string,
): string | null => {
  const normalizedPlanId = normalizePlanId(planId);
  const normalizedInterval = normalizeInterval(interval);

  if (!isPaidPlan(normalizedPlanId)) {
    return null;
  }

  if (!isInterval(normalizedInterval)) {
    return null;
  }

  return RAZORPAY_PLAN_IDS[normalizedPlanId][normalizedInterval] ?? null;
};

export const getSubscriptionDays = (interval: Interval) => {
  if (interval === "yearly") return 365;
  if (interval === "monthly") return 30;

  return null;
};

export const getEffectivePlanId = (user: IUser): PlanKey => {
  const sub = user?.subscription;

  if (!sub) {
    return "free";
  }

  const planId = normalizePlanId(sub.planId || "free");

  if (!isPlanKey(planId)) {
    return "free";
  }

  const status = String(sub.status || "").toLowerCase();

  const periodEnd = sub.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).getTime()
    : null;

  const active =
    status === "active" &&
    periodEnd !== null &&
    Number.isFinite(periodEnd) &&
    periodEnd > Date.now();

  if (active && isPaidPlan(planId)) {
    return planId as PlanKey;
  }

  return "free";
};

export const getEntitlements = (planId: string) => {
  const plan = getPlan(planId) || BILLING_PLANS.free;

  return plan.limits;
};

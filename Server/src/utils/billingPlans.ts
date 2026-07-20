import { IUser } from "../models/User";

export const BILLING_PLANS = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Explore FocusHub",
    prices: { monthly: 0, yearly: 0 },
    limits: {
      goals: 3,
      tasks: { high: 1, medium: 2, low: 3 },
    },
  },
  basic: {
    id: "basic",
    name: "Basic",
    tagline: "More room to plan",
    prices: { monthly: 49, yearly: 499 },
    limits: {
      goals: 5,
      tasks: { high: 2, medium: 4, low: 6 },
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Best value for builders",
    prices: { monthly: 99, yearly: 999 },
    limits: {
      goals: 10,
      tasks: { high: 4, medium: 8, low: 12 },
    },
  },
  elite: {
    id: "elite",
    name: "Elite",
    tagline: "Unlimited + early access",
    prices: { monthly: 129, yearly: 1299 },
    limits: {
      goals: null, // unlimited
      tasks: { high: null, medium: null, low: null }, // unlimited
    },
  },
} as const;

export const PLAN_ORDER = ["free", "basic", "pro", "elite"];
export const PAID_PLANS = ["basic", "pro", "elite"];
export const VALID_INTERVALS = ["monthly", "yearly"] as const;

export type Interval = (typeof VALID_INTERVALS)[number];

export type PlanKey = keyof typeof BILLING_PLANS;

export const normalizePlanId = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const isPlanKey = (key: string): key is PlanKey => {
  return key in BILLING_PLANS;
};

export const normalizeInterval = (value: string) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const isInterval = (value: string): value is Interval => {
  return VALID_INTERVALS.includes(value as Interval);
};

export const getPlan = (planId: string) => {
  const key = normalizePlanId(planId);

  if (!isPlanKey(key)) {
    return null;
  }

  return BILLING_PLANS[key];
};

export const isPaidPlan = (planId: string) =>
  PAID_PLANS.includes(normalizePlanId(planId));

export const getPublicPlans = () => {
  return PLAN_ORDER.map((id) => {
    if (!isPlanKey(id)) return undefined;
    return BILLING_PLANS[id];
  }).filter(Boolean);
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

export const getSubscriptionDays = (interval: Interval) => {
  const normalizedInterval = normalizeInterval(interval);
  if (normalizedInterval === "yearly") return 365;
  if (normalizedInterval === "monthly") return 30;
  return null;
};

export const getEffectivePlanId = (user: IUser) => {
  const sub = user?.subscription || null;
  const now = Date.now();

  if (!sub) return "free";

  const planId = normalizePlanId(sub.planId || "free");
  const status = String(sub.status || "").toLowerCase();
  const periodEnd = sub.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).getTime()
    : null;

  const active =
    status === "active" &&
    periodEnd !== null &&
    Number.isFinite(periodEnd) &&
    periodEnd > now;

  if (active && isPaidPlan(planId)) {
    return "free";
  }

  return planId;
};

export const getEntitlements = (planId: string) => {
  const plan = getPlan(planId) || BILLING_PLANS.free;
  return plan.limits;
};

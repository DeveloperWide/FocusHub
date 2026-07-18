const BILLING_PLANS = Object.freeze({
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
});

const PLAN_ORDER = ["free", "basic", "pro", "elite"];
const PAID_PLANS = ["basic", "pro", "elite"];
const VALID_INTERVALS = ["monthly", "yearly"];

const normalizePlanId = (value) => String(value || "").trim().toLowerCase();
const normalizeInterval = (value) => String(value || "").trim().toLowerCase();

const getPlan = (planId) => {
  const key = normalizePlanId(planId);
  return BILLING_PLANS[key] || null;
};

const isPaidPlan = (planId) => PAID_PLANS.includes(normalizePlanId(planId));

const getPublicPlans = () => {
  return PLAN_ORDER.map((id) => BILLING_PLANS[id]).filter(Boolean);
};

const getPlanPriceRupees = (planId, interval) => {
  const plan = getPlan(planId);
  const normalizedInterval = normalizeInterval(interval);
  if (!plan || !VALID_INTERVALS.includes(normalizedInterval)) return null;
  return Number(plan.prices?.[normalizedInterval] ?? 0);
};

const getSubscriptionDays = (interval) => {
  const normalizedInterval = normalizeInterval(interval);
  if (normalizedInterval === "yearly") return 365;
  if (normalizedInterval === "monthly") return 30;
  return null;
};

const getEffectivePlanId = (user) => {
  const sub = user?.subscription || null;
  const now = Date.now();

  if (!sub) return "free";

  const planId = normalizePlanId(sub.planId || "free");
  const status = String(sub.status || "").toLowerCase();
  const periodEnd = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() : null;

  const active =
    status === "active" && Number.isFinite(periodEnd) && periodEnd > now;

  return active && BILLING_PLANS[planId] ? planId : "free";
};

const getEntitlements = (planId) => {
  const plan = getPlan(planId) || BILLING_PLANS.free;
  return plan.limits;
};

module.exports = {
  BILLING_PLANS,
  PAID_PLANS,
  VALID_INTERVALS,
  normalizePlanId,
  normalizeInterval,
  getPlan,
  getPublicPlans,
  getPlanPriceRupees,
  getSubscriptionDays,
  getEffectivePlanId,
  getEntitlements,
  isPaidPlan,
};

export const BILLING_PLANS = Object.freeze({
  free: {
    id: "free",
    name: "Free",
    prices: { monthly: 0, yearly: 0 },
    limits: { goals: 3, tasks: { high: 1, medium: 2, low: 3 } },
  },
  basic: {
    id: "basic",
    name: "Basic",
    tagline: "More room to plan",
    badge: null,
    prices: { monthly: 49, yearly: 499 },
    limits: { goals: 5, tasks: { high: 2, medium: 4, low: 6 } },
    features: [
      "More daily tasks per priority",
      "Up to 5 active goals",
      "Focus charts & split",
      "Export-ready task tags",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Best value for builders",
    badge: "Best value",
    prices: { monthly: 99, yearly: 999 },
    limits: { goals: 10, tasks: { high: 4, medium: 8, low: 12 } },
    features: [
      "Up to 10 active goals",
      "Bigger daily task limits",
      "Longer focus history (coming soon)",
      "Priority roadmap access",
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    tagline: "Unlimited + early access",
    badge: "Early access",
    prices: { monthly: 129, yearly: 1299 },
    limits: { goals: null, tasks: { high: null, medium: null, low: null } },
    features: [
      "Unlimited goals & tasks",
      "Early access to new features",
      "Integrations (coming soon)",
      "Priority support",
    ],
  },
});

export const PAID_PLAN_IDS = ["basic", "pro", "elite"];

export const formatInr = (rupees) => {
  const value = Number(rupees || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const getEffectivePlanId = (user) => {
  const sub = user?.subscription;
  if (!sub) return "free";

  const status = String(sub.status || "").toLowerCase();
  const planId = String(sub.planId || "free").toLowerCase();

  const endMs = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() : null;
  const active = status === "active" && Number.isFinite(endMs) && endMs > Date.now();

  return active && BILLING_PLANS[planId] ? planId : "free";
};

export const getEntitlements = (planId) => {
  const key = String(planId || "").toLowerCase();
  return (BILLING_PLANS[key] || BILLING_PLANS.free).limits;
};

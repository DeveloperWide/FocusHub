"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntitlements = exports.getEffectivePlanId = exports.getSubscriptionDays = exports.getRazorpayPlanId = exports.getPlanPriceRupees = exports.getPublicPlans = exports.isPaidPlan = exports.getPlan = exports.isInterval = exports.normalizeInterval = exports.isPlanKey = exports.normalizePlanId = exports.VALID_INTERVALS = exports.PAID_PLANS = exports.PLAN_ORDER = exports.BILLING_PLANS = void 0;
const razorpayPlans_1 = require("./razorpayPlans");
exports.BILLING_PLANS = {
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
};
exports.PLAN_ORDER = ["free", "basic", "pro", "elite"];
exports.PAID_PLANS = ["basic", "pro", "elite"];
exports.VALID_INTERVALS = ["monthly", "yearly"];
const normalizePlanId = (value) => String(value || "")
    .trim()
    .toLowerCase();
exports.normalizePlanId = normalizePlanId;
const isPlanKey = (key) => {
    return Object.prototype.hasOwnProperty.call(exports.BILLING_PLANS, key);
};
exports.isPlanKey = isPlanKey;
const normalizeInterval = (value) => String(value || "")
    .trim()
    .toLowerCase();
exports.normalizeInterval = normalizeInterval;
const isInterval = (value) => {
    return exports.VALID_INTERVALS.includes(value);
};
exports.isInterval = isInterval;
const getPlan = (planId) => {
    const key = (0, exports.normalizePlanId)(planId); // " PRO " , "pro"
    if (!(0, exports.isPlanKey)(key)) {
        return null;
    }
    return exports.BILLING_PLANS[key];
};
exports.getPlan = getPlan;
const isPaidPlan = (planId) => {
    return exports.PAID_PLANS.includes((0, exports.normalizePlanId)(planId));
};
exports.isPaidPlan = isPaidPlan;
const getPublicPlans = () => {
    return exports.PLAN_ORDER.map((id) => {
        const plan = exports.BILLING_PLANS[id];
        return {
            id: plan.id,
            name: plan.name,
            tagline: plan.tagline,
            prices: plan.prices,
            limits: plan.limits,
        };
    });
};
exports.getPublicPlans = getPublicPlans;
const getPlanPriceRupees = (planId, interval) => {
    const plan = (0, exports.getPlan)(planId);
    const normalizedInterval = (0, exports.normalizeInterval)(interval);
    if (!plan || !(0, exports.isInterval)(normalizedInterval)) {
        return 0;
    }
    return plan.prices[normalizedInterval];
};
exports.getPlanPriceRupees = getPlanPriceRupees;
const getRazorpayPlanId = (planId, interval) => {
    const normalizedPlanId = (0, exports.normalizePlanId)(planId);
    const normalizedInterval = (0, exports.normalizeInterval)(interval);
    if (!(0, exports.isPaidPlan)(normalizedPlanId)) {
        return null;
    }
    if (!(0, exports.isInterval)(normalizedInterval)) {
        return null;
    }
    return razorpayPlans_1.RAZORPAY_PLAN_IDS[normalizedPlanId][normalizedInterval] ?? null;
};
exports.getRazorpayPlanId = getRazorpayPlanId;
const getSubscriptionDays = (interval) => {
    if (interval === "yearly")
        return 365;
    if (interval === "monthly")
        return 30;
    return null;
};
exports.getSubscriptionDays = getSubscriptionDays;
const getEffectivePlanId = (user) => {
    const sub = user?.subscription;
    if (!sub) {
        return "free";
    }
    const planId = (0, exports.normalizePlanId)(sub.planId || "free");
    if (!(0, exports.isPlanKey)(planId)) {
        return "free";
    }
    const status = String(sub.status || "").toLowerCase();
    const periodEnd = sub.currentPeriodEnd
        ? new Date(sub.currentPeriodEnd).getTime()
        : null;
    const active = status === "active" &&
        periodEnd !== null &&
        Number.isFinite(periodEnd) &&
        periodEnd > Date.now();
    if (active && (0, exports.isPaidPlan)(planId)) {
        return planId;
    }
    return "free";
};
exports.getEffectivePlanId = getEffectivePlanId;
const getEntitlements = (planId) => {
    const plan = (0, exports.getPlan)(planId) || exports.BILLING_PLANS.free;
    return plan.limits;
};
exports.getEntitlements = getEntitlements;

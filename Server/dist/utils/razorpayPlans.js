"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAZORPAY_PLAN_IDS = void 0;
exports.RAZORPAY_PLAN_IDS = {
    basic: {
        monthly: process.env.RAZORPAY_MONTHLY_BASIC_PLANID,
        yearly: process.env.RAZORPAY_YEARLY_BASIC_PLANID,
    },
    pro: {
        monthly: process.env.RAZORPAY_MONTHLY_PRO_PLANID,
        yearly: process.env.RAZORPAY_YEARLY_PRO_PLANID,
    },
    elite: {
        monthly: process.env.RAZORPAY_MONTHLY_ELITE_PLANID,
        yearly: process.env.RAZORPAY_YEARLY_ELITE_PLANID,
    },
};

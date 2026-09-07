"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const requiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
exports.env = {
    RAZORPAY_KEY_ID: requiredEnv("RAZORPAY_KEY_ID"),
    RAZORPAY_KEY_SECRET: requiredEnv("RAZORPAY_KEY_SECRET"),
};

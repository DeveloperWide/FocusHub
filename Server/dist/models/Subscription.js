"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    interval: {
        type: String,
        enum: ["monthly", "yearly"],
        required: true,
    },
    planId: {
        type: String,
        enum: ["basic", "pro", "elite"],
        required: true,
    },
    razorpaySubscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    razorpayPlanId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "created",
            "authenticated",
            "active",
            "pending",
            "halted",
            "cancelled",
            "completed",
            "expired",
        ],
        default: "created",
        index: true,
    },
    currentPeriodStart: {
        type: Date,
        default: null,
    },
    currentPeriodEnd: {
        type: Date,
        default: null,
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false,
    },
    cancelledAt: {
        type: Date,
        default: null,
    },
    endedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
subscriptionSchema.index({ user: 1, status: 1 });
const Subscription = (0, mongoose_1.model)("Subscription", subscriptionSchema);
exports.default = Subscription;

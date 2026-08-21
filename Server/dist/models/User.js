"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const reservedUsernames = [
    "admin",
    "support",
    "api",
    "login",
    "signup",
    "dashboard",
    "root",
];
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/,
        validate: {
            validator: function (v) {
                return !reservedUsernames.includes(v);
            },
            message: "Username not allowed",
        },
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        url: {
            type: String,
            default: "",
        },
        filename: {
            type: String,
            default: "",
        },
    },
    subscription: {
        planId: {
            type: String,
            enum: ["free", "basic", "pro", "elite"],
            default: "free",
        },
        interval: {
            type: String,
            enum: ["monthly", "yearly", null],
            default: null,
        },
        status: {
            type: String,
            enum: ["free", "active", "expired", "canceled"],
            default: "free",
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
        razorpay: {
            lastOrderId: { type: String, default: "" },
            lastPaymentId: { type: String, default: "" },
        },
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id; // convert _id -> id
            delete ret._id; // remove _id
            delete ret.__v; // remove version key
            delete ret.password;
            return ret;
        },
    },
});
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 10);
    next();
});
// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt_1.default.compare(enteredPassword, this.password);
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.login = exports.signup = exports.suggestUsername = exports.checkUsername = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "fh_session";
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
const SESSION_MAX_AGE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;
// const COOKIE_SAME_SITE = process.env.COOKIE_SAME_SITE;
if (!JWT_SECRET) {
    throw new Error(`JWT_SECRET is not defined in env`);
}
const getCookieSecurityOptions = () => {
    const isProd = process.env.NODE_ENV === "production";
    const secure = process.env.COOKIE_SECURE != null
        ? process.env.COOKIE_SECURE === "true"
        : isProd;
    const sameSite = isProd ? "none" : "lax";
    return { secure, sameSite };
};
const getAuthCookieOptions = () => {
    const { secure, sameSite } = getCookieSecurityOptions();
    return {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: SESSION_MAX_AGE_MS,
        path: "/",
    };
};
const setAuthCookie = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, {
        expiresIn: `${SESSION_DAYS}d`,
    });
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    return { token };
};
const clearAuthCookie = (res) => {
    const { secure, sameSite } = getCookieSecurityOptions();
    res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        secure,
        sameSite,
        path: "/",
    });
};
exports.checkUsername = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    if (typeof req.params?.username !== "string") {
        return res.status(400).json({ message: "username must be a string" });
    }
    console.log(req.params.username);
    const username = req.params.username.toLowerCase();
    const user = await User_1.default.findOne({ username });
    console.log(user);
    if (user) {
        return res.json({
            available: false,
        });
    }
    return res.json({
        available: true,
    });
});
exports.suggestUsername = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    if (typeof req.params?.username !== "string") {
        return res.status(400).json({ message: "username must be a string" });
    }
    const base = req.params.username.toLowerCase();
    const suggestions = [];
    for (let i = 0; i < 5; i++) {
        const random = Math.floor(Math.random() * 9999);
        suggestions.push(`${base}_${random}`);
    }
    const availableSuggestions = [];
    for (let name of suggestions) {
        const exists = await User_1.default.findOne({ username: name });
        if (!exists) {
            availableSuggestions.push(name);
        }
    }
    res.json({
        suggestions: availableSuggestions,
    });
});
exports.signup = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    console.log(req.body);
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        throw new ExpressError_1.default(400, "User Already Exists");
    let user = new User_1.default({ name, username, email, password });
    let svdUser = await user.save();
    if (!svdUser)
        throw new ExpressError_1.default(500, "failed To Save User");
    const token = setAuthCookie(res, svdUser._id);
    res.status(201).json({
        message: `User created successfully`,
        user: svdUser,
        token: token.token,
    });
});
exports.login = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    let user = await User_1.default.findOne({ email });
    if (!user)
        throw new ExpressError_1.default(400, "No User Found w/ This Email");
    let isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw new ExpressError_1.default(400, "Invalid credentials");
    setAuthCookie(res, user._id);
    res.status(200).json({
        message: `Successfully logged in.`,
        user,
    });
});
const logout = (req, res) => {
    clearAuthCookie(res);
    res.status(200).json({ message: "Logged out" });
};
exports.logout = logout;
exports.me = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    if (!req.user) {
        throw new ExpressError_1.default(404, "User Not Found");
    }
    const user = await User_1.default.findById(req.user.id);
    if (!user)
        throw new ExpressError_1.default(404, "User Not Found");
    res.status(200).json({ user });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "fh_session";
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
const SESSION_MAX_AGE_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;
const getCookieSecurityOptions = () => {
    const isProd = process.env.NODE_ENV === "production";
    const secure = process.env.COOKIE_SECURE != null
        ? process.env.COOKIE_SECURE === "true"
        : isProd;
    const sameSite = process.env.COOKIE_SAME_SITE || (isProd ? "none" : "lax");
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
// Add middlewares like isOwner & isAdmin
const authenticateUser = (req, res, next) => {
    try {
        const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
        const authHeader = req.headers.authorization;
        const headerToken = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = cookieToken || headerToken;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Authentication failed: No token provided." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded == "string") {
            return res.status(400).json({ message: "Invalid token" });
        }
        const payload = decoded;
        // ✅ Attach decoded user info to req.user
        req.user = { id: payload.id };
        if (cookieToken) {
            const refreshedToken = jsonwebtoken_1.default.sign({ id: decoded.id }, JWT_SECRET, {
                expiresIn: `${SESSION_DAYS}d`,
            });
            res.cookie(AUTH_COOKIE_NAME, refreshedToken, getAuthCookieOptions());
        }
        next();
    }
    catch (err) {
        if (req.cookies?.[AUTH_COOKIE_NAME]) {
            const { secure, sameSite } = getCookieSecurityOptions();
            res.clearCookie(AUTH_COOKIE_NAME, {
                httpOnly: true,
                secure,
                sameSite,
                path: "/",
            });
        }
        return res
            .status(401)
            .json({ message: "Authentication failed: Invalid or expired token." });
    }
};
exports.authenticateUser = authenticateUser;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const dotenv_1 = __importDefault(require("dotenv"));
// Error handler Utilities
const errorHandler_1 = require("./utils/errorHandler");
const ExpressError_1 = __importDefault(require("./utils/ExpressError"));
// Models
const Task_1 = __importDefault(require("./models/Task"));
const Goal_1 = __importDefault(require("./models/Goal"));
const FocusTimer_1 = __importDefault(require("./models/FocusTimer"));
const User_1 = __importDefault(require("./models/User"));
const Promo_1 = __importDefault(require("./models/Promo"));
const BillingOrder_1 = __importDefault(require("./models/BillingOrder"));
// Routes
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const focusRoutes_1 = __importDefault(require("./routes/focusRoutes"));
const billingRoutes_1 = __importDefault(require("./routes/billingRoutes"));
// data
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const defaultAllowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
];
const envAllowedOrigins = String(process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;
app.use((0, cors_1.default)((req, callback) => {
    const origin = req.header("Origin");
    if (!origin) {
        return callback(null, {
            origin: true,
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            allowedHeaders: ["Content-Type", "Authorization", "x-tz-offset"],
        });
    }
    let isAllowed = allowedOrigins.includes(origin);
    if (!isAllowed) {
        try {
            const originHost = new URL(origin).host;
            const requestHost = req.header("host");
            if (originHost && requestHost && originHost === requestHost) {
                isAllowed = true;
            }
        }
        catch (_) {
            isAllowed = false;
        }
    }
    return callback(null, {
        origin: isAllowed ? origin : false,
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization", "x-tz-offset"],
    });
}));
// API Routes
app.use("/api/tasks", taskRoutes_1.default);
app.use("/api/goals", goalRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/profile", profileRoutes_1.default);
app.use("/api/focus", focusRoutes_1.default);
app.use("/api/billing", billingRoutes_1.default);
// 404 Route Handler
app.use((req, res, next) => {
    next(new ExpressError_1.default(404, `Route ${req.originalUrl} not found`));
});
// Error Handling Middleware
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await (0, db_1.connectDb)();
        console.log("Connected to Db");
        // Keep indexes aligned with schemas (small app; safe for publish)
        await Promise.all([
            Task_1.default.syncIndexes(),
            Goal_1.default.syncIndexes(),
            FocusTimer_1.default.syncIndexes(),
            User_1.default.syncIndexes(),
            Promo_1.default.syncIndexes(),
            BillingOrder_1.default.syncIndexes(),
        ]);
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}`);
        });
    }
    catch (err) {
        console.log("----ERROR----");
        console.log(err);
        process.exit(1);
    }
};
startServer();

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/db";

// Error handler Utilities
import { errorHandler } from "./utils/errorHandler";
import ExpressError from "./utils/ExpressError";

// Models
import Task from "./models/Task";
import Goal from "./models/Goal";
import FocusTimer from "./models/FocusTimer";
import User from "./models/User";
import Promo from "./models/Promo";
import BillingOrder from "./models/Payment";
import ContactMessage from "./models/ContactMessage";

// Routes
import taskRoutes from "./routes/taskRoutes";
import goalRoutes from "./routes/goalRoutes";
import profileRoutes from "./routes/profileRoutes";
import authRoutes from "./routes/authRoutes";
import focusRoutes from "./routes/focusRoutes";
import billingRoutes from "./routes/billingRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import contactRoutes from "./routes/contactRoutes";

// data
const app = express();
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());

const defaultAllowedOrigins = ["http://localhost:5173"];

const envAllowedOrigins = String(process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins =
  envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;

app.use(
  cors((req, callback) => {
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
      } catch (_) {
        isAllowed = false;
      }
    }

    return callback(null, {
      origin: isAllowed ? origin : false,
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: ["Content-Type", "Authorization", "x-tz-offset"],
    });
  }),
);

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/focus", focusRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/contact", contactRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  next(new ExpressError(404, `Route ${req.originalUrl} not found`));
});

// Error Handling Middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDb();
    console.log("Connected to Db");

    // Keep indexes aligned with schemas (small app; safe for publish)
    await Promise.all([
      Task.syncIndexes(),
      Goal.syncIndexes(),
      FocusTimer.syncIndexes(),
      User.syncIndexes(),
      Promo.syncIndexes(),
      BillingOrder.syncIndexes(),
      ContactMessage.syncIndexes(),
    ]);

    app.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    });
  } catch (err) {
    console.log("----ERROR----");
    console.log(err);
    process.exit(1);
  }
};

startServer();

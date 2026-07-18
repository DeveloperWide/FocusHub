const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8080;
const errorHandler = require("./utils/errorHandler");
const ExpressError = require("./utils/ExpressError");

const Task = require("./models/Task");
const Goal = require("./models/Goal");
const FocusTimer = require("./models/FocusTimer");
const User = require("./models/User");
const Promo = require("./models/Promo");
const BillingOrder = require("./models/BillingOrder");

// Routes
const taskRoutes = require("./routes/taskRoutes");
const goalRoutes = require("./routes/goalRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const focusRoutes = require("./routes/focusRoutes");
const billingRoutes = require("./routes/billingRoutes");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());

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

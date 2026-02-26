const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb } = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 8080;
const errorHandler = require("./utils/errorHandler");
const ExpressError = require("./utils/ExpressError");

// Connect to Db
connectDb()
  .then(() => console.log(`Connected to Db`))
  .catch((err) => {
    console.log("----ERROR----");
    console.log(err);
  });

// Routes
const taskRoutes = require("./routes/taskRoutes");
const goalRoutes = require("./routes/goalRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const focusRoutes = require("./routes/focusRoutes");

app.use(express.json());

// Dynamic CORS based on environment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://focushub-ygwq.onrender.com" // Production deployed URL
      : "http://localhost:5173", // Local development URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/focus", focusRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  next(new ExpressError(404, `Route ${req.originalUrl} not found`));
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

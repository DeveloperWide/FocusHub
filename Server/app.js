const express = require("express");
const app = express();
const cors = require("cors");
const { connectDb } = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 8080;
const errorHandler = require("./utils/errorHandler")
const ExpressError = require("./utils/ExpressError")

// Connect to Db
connectDb().then(() => {
    console.log(`Connected to Db`);
}).catch((err) => {
    console.log("----ERROR----");
    console.log(err)
});

// Routes
const taskRoutes = require("./routes/taskRoutes");
const goalRoutes = require("./routes/goalRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const quoteRoutes = require("./routes/quoteRoutes")


app.use(express.json());
// app.use(cookieParser())
app.use(cors({
    origin: "https://focushub-ygwq.onrender.com"
}))

app.use("/api/tasks" , taskRoutes);
app.use("/api/goals" , goalRoutes);
app.use("/api/auth" , authRoutes);
app.use("/api/profile" , profileRoutes);
app.use("/api/quote" , quoteRoutes);

app.use((req, res, next) => {
  next(new ExpressError(404, `Route ${req.originalUrl} not found`));
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listing on PORT 8080`)
})
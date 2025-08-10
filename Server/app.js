const express = require("express");
const app = express();
const cors = require("cors");
// const cookieParser = require("cookie-parser")
const { connectDb } = require("./config/db");
const dotenv = require("dotenv").config();
const PORT = 8080;

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
    origin: "http://localhost:5173"
}))

app.use("/api/tasks" , taskRoutes);
app.use("/api/goals" , goalRoutes);
app.use("/api/auth" , authRoutes);
app.use("/api/profile" , profileRoutes);
app.use("/api/quote" , quoteRoutes);

app.listen(PORT, () => {
    console.log(`Server is listing on PORT 8080`)
})
const mongoose = require("mongoose");

// Connect to MongoDB
module.exports.connectDb = async () => {
    await mongoose.connect(process.env.DB_URL || "mongodb+srv://maheshranacodes:e1xkzufXp6PT9SUT@cluster0.yxocuiv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}
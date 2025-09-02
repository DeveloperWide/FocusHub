const mongoose = require("mongoose");

// Connect to MongoDB
module.exports.connectDb = async () => {
    await mongoose.connect(process.env.DB_URL)
}
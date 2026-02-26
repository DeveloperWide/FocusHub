const mongoose = require("mongoose");

// Connect to MongoDB
module.exports.connectDb = async () => {
  await mongoose.connect(
    process.env.DB_URL || "mongodb://127.0.0.1:27017/focushub",
  );
};

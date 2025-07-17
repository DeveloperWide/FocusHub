const mongoose = require("mongoose");

module.exports.connectDb = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/focushub")
}
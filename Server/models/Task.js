const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //   createdAt: { type: Date, default: Date.now },
});

const Task = model("Task", taskSchema);
module.exports = Task;

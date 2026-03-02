const mongoose = require("mongoose");
const { validate } = require("./Goal");
const { model, Schema } = mongoose;

const taskSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["day-task", "goal-linked"],
    },

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

    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      validate: {
        validator: function (value) {
          if (this.type == "day-task") {
            return value == null;
          }
          if (this.type == "goal-linked") {
            return value != null;
          }

          return true;
        },
        message:
          "Goal must exist for goal-linked tasks and be null for day-task.",
      },

      isComplete: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

const Task = model("Task", taskSchema);
module.exports = Task;

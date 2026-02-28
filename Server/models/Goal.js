let mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    tag: { type: String, required: true },
  },
  { timestamps: true },
);

const Goal = model("Goal", goalSchema);
module.exports = Goal;

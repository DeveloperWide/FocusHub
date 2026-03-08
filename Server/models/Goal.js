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
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id; // convert _id -> id
        delete ret._id; // remove _id
        delete ret.__v; // remove version key
        return ret;
      },
    },
  },
);

const Goal = model("Goal", goalSchema);
module.exports = Goal;

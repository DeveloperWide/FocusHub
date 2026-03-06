const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const focusSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },

    taskDuration: {
      type: Number,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
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

const Focus = model("Focus", focusSchema);

module.exports = Focus;

const mongoose = require("mongoose");
const { validate } = require("./User");
const { model, Schema } = mongoose;

const focusSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      validate: {
        validator: function (value) {
          if (this.title === "") {
            return value != null;
          }
          if (this.title.length > 0) {
            return value == null;
          }

          return true;
        },
        message:
          "Task must exist for task-linked Timers and be null for normal focus Timer.",
      },
      ref: "Task",
    },

    focusDuration: {
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

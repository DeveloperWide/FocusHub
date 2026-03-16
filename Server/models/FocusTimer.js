const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const focusTimerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    durationSeconds: {
      type: Number,
      required: true,
      min: 1,
    },

    mode: {
      type: String,
      enum: ["focus", "shortBreak", "longBreak"],
      default: "focus",
    },

    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    linkType: {
      type: String,
      enum: ["goal", "personal"],
      default: "personal",
    },

    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },

    // Snapshot tag for display/debugging (optional)
    goalTag: {
      type: String,
      default: null,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

focusTimerSchema.pre("validate", function (next) {
  const hasGoal = Boolean(this.goal);

  if (hasGoal) this.linkType = "goal";
  else this.linkType = "personal";

  return next();
});

focusTimerSchema.index({ user: 1, endedAt: -1 });
focusTimerSchema.index({ user: 1, linkType: 1, endedAt: -1 });

const FocusTimer = model("FocusTimer", focusTimerSchema);

module.exports = FocusTimer;

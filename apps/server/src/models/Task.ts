import mongoose, { HydratedDocument, Schema, model } from "mongoose";

export interface ITaskSchema {
  type: string;
  title: string;
  priority: "high" | "medium" | "low";
  tag: string;
  dayKey: string;
  user: mongoose.Schema.Types.ObjectId;
  goal: mongoose.Schema.Types.ObjectId | null;
  isComplete: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updateAt: Date;
}

const taskSchema = new Schema<ITaskSchema>(
  {
    type: {
      type: String,
      default: "task",
    },

    title: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
    },

    tag: {
      type: String,
      required: true,
      trim: true,
    },

    dayKey: {
      type: String,
      required: true,
      default: () => new Date().toISOString().slice(0, 10),
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
      validate: {
        validator: function (value) {
          if (this.type == "task") {
            return value == null;
          }
          if (this.type !== "task") {
            return value != null;
          }

          return true;
        },
        message:
          "Goal must exist for goal-linked tasks and be null for day-task.",
      },
    },

    isComplete: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id; // convert _id -> id
        delete ret._id; // remove _id
        delete ret.__v; // remove version key
        return ret;
      },
    },
  },
);

taskSchema.index({ user: 1, dayKey: 1, tag: 1 }, { unique: true });
taskSchema.index({ user: 1, dayKey: 1, isComplete: 1, priority: 1 });

taskSchema.pre(
  "validate",
  function (this: HydratedDocument<ITaskSchema>, next) {
    if (!this.dayKey) {
      const base = this.createdAt instanceof Date ? this.createdAt : new Date();
      this.dayKey = base.toISOString().slice(0, 10);
    }

    next();
  },
);

taskSchema.pre("save", function (next) {
  if (this.isModified("isComplete")) {
    if (this.isComplete && !this.completedAt) this.completedAt = new Date();
    if (!this.isComplete) this.completedAt = null;
  }

  next();
});

const Task = model<ITaskSchema>("Task", taskSchema);
export default Task;

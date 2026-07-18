import { Schema, model } from "mongoose";

interface IGoalSchema {
  title: string;
  tag: string;
  user: Schema.Types.ObjectId;
}

const goalSchema = new Schema<IGoalSchema>(
  {
    title: {
      type: String,
      required: true,
    },

    // Add Completed, Giveup  & days field
    tag: {
      type: String,
      required: true,
      trim: true,
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
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id; // convert _id -> id
        delete ret._id; // remove _id
        delete ret.__v; // remove version key
        return ret;
      },
    },
  },
);

goalSchema.index({ user: 1, tag: 1 }, { unique: true });

const Goal = model<IGoalSchema>("Goal", goalSchema);
export default Goal;

import { Schema, model } from "mongoose";

interface IFocusSchema {
  title: string;
  task: Schema.Types.ObjectId;
  focusDuration: number;
  user: Schema.Types.ObjectId;
}

const focusSchema = new Schema<IFocusSchema>(
  {
    title: {
      type: String,
      required: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
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
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id; // convert _id -> id
        delete ret._id; // remove _id
        delete ret.__v; // remove version key
        return ret;
      },
    },
  },
);

const Focus = model<IFocusSchema>("Focus", focusSchema);

export default Focus;

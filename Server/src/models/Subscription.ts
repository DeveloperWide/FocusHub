import { Schema, model, Types } from "mongoose";

export interface ISubscription {
  user: Types.ObjectId;

  planId: "basic" | "pro" | "elite";
  interval: "monthly" | "yearly";

  razorpaySubscriptionId: string;
  razorpayPlanId: string;

  status:
    | "created"
    | "authenticated"
    | "active"
    | "pending"
    | "halted"
    | "cancelled"
    | "completed"
    | "expired";

  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;

  cancelAtPeriodEnd: boolean;
  cancelledAt: Date | null;

  endedAt: Date | null;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    interval: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },

    planId: {
      type: String,
      enum: ["basic", "pro", "elite"],
      required: true,
    },

    razorpaySubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    razorpayPlanId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "authenticated",
        "active",
        "pending",
        "halted",
        "cancelled",
        "completed",
        "expired",
      ],
      default: "created",
      index: true,
    },

    currentPeriodStart: {
      type: Date,
      default: null,
    },

    currentPeriodEnd: {
      type: Date,
      default: null,
    },

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

subscriptionSchema.index({ user: 1, status: 1 });

const Subscription = model("Subscription", subscriptionSchema);
export default Subscription;

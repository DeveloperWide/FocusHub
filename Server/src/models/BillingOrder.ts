import { Schema, model } from "mongoose";

interface IBillingOrder {
  user: {
    type: string;
  };
  planId: string;
  interval: string;
  currency: string;
  baseAmount: number;
  amount: number;
  promoKey: string;
  earlyBirdReserved: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: "created" | "paid" | "failed";
  paidAt: Date;
}

const billingOrderSchema = new Schema<IBillingOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: { type: String, required: true },
    interval: { type: String, required: true },

    currency: { type: String, default: "INR" },

    baseAmount: { type: Number, required: true }, // paise
    amount: { type: Number, required: true }, // paise (after discount)

    promoKey: { type: String, default: null },
    earlyBirdReserved: { type: Boolean, default: false },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
      index: true,
    },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true },
);

billingOrderSchema.index({ createdAt: 1 });

const BillingOrder = model<IBillingOrder>("BillingOrder", billingOrderSchema);
export default BillingOrder;

import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";

const reservedUsernames = [
  "admin",
  "support",
  "api",
  "login",
  "signup",
  "dashboard",
  "root",
];

export interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
  profileImage: {
    url: string;
    filename: string;
  };
  subscription: {
    planId: "free" | "basic" | "pro" | "elite";
    interval: "monthly" | "yearly" | null;
    status: "free" | "active" | "expired" | "canceled";
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;

    cancelAtPeriodEnd: boolean;
    subscriptionId: string | null;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: /^[a-zA-Z0-9_]+$/,
      validate: {
        validator: function (v) {
          return !reservedUsernames.includes(v);
        },
        message: "Username not allowed",
      },
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      filename: {
        type: String,
        default: "",
      },
    },

    subscription: {
      planId: {
        type: String,
        enum: ["free", "basic", "pro", "elite"],
        default: "free",
      },
      interval: {
        type: String,
        enum: ["monthly", "yearly", null],
        default: null,
      },
      status: {
        type: String,
        enum: ["free", "active", "expired", "canceled"],
        default: "free",
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
      razorpay: {
        lastOrderId: { type: String, default: "" },
        lastPaymentId: { type: String, default: "" },
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: Record<string, any>) {
        ret.id = ret._id; // convert _id -> id
        delete ret._id; // remove _id
        delete ret.__v; // remove version key
        delete ret.password;
        return ret;
      },
    },
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>("User", userSchema);
export default User;

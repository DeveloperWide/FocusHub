import { Schema, model } from "mongoose";
interface IPromoSchema {
  key: string;
  active: boolean;
  limit: number;
  claimed: number;
  reserved: number;
  discountPercent: number;
}

const promoSchema = new Schema<IPromoSchema>(
  {
    key: { type: String, required: true, unique: true, index: true },
    active: { type: Boolean, default: true },
    limit: { type: Number, required: true },
    claimed: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 15 },
  },
  { timestamps: true },
);

promoSchema.methods.remaining = function () {
  const limit = Number(this.limit || 0);
  const claimed = Number(this.claimed || 0);
  const reserved = Number(this.reserved || 0);
  return Math.max(0, limit - claimed - reserved);
};

const Promo = model<IPromoSchema>("Promo", promoSchema);
export default Promo;

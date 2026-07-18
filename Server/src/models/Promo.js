const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const promoSchema = new Schema(
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

const Promo = model("Promo", promoSchema);
module.exports = Promo;


const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, default: "", maxlength: 500 },
    code: { type: String, required: true, trim: true, uppercase: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
      default: "percentage",
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscount: { type: Number, default: 0, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    scope: {
      type: String,
      enum: ["all", "products", "categories"],
      default: "all",
    },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    categories: [{ type: String }],
    usageLimit: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    autoApply: { type: Boolean, default: false },
  },
  { timestamps: true },
);

promotionSchema.index({ code: 1 }, { unique: true });
promotionSchema.index({ vendor: 1, createdAt: -1 });
promotionSchema.index({ isActive: 1, startsAt: 1, endsAt: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);

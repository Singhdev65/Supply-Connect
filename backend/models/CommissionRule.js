const mongoose = require("mongoose");

const commissionRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    scope: {
      type: String,
      enum: ["global", "category", "seller"],
      required: true,
      default: "global",
    },
    category: { type: String, trim: true, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    commissionRate: { type: Number, required: true, min: 0, max: 1 },
    platformFee: { type: Number, default: 0, min: 0 },
    transactionFeeRate: { type: Number, default: 0, min: 0, max: 1 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

commissionRuleSchema.index({ scope: 1, category: 1, seller: 1, createdAt: -1 });
commissionRuleSchema.index({ isActive: 1, startsAt: 1, endsAt: 1 });

module.exports = mongoose.model("CommissionRule", commissionRuleSchema);

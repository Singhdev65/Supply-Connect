const mongoose = require("mongoose");

const marketingBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    imageUrl: { type: String, required: true, trim: true },
    ctaText: { type: String, default: "", trim: true, maxlength: 60 },
    ctaUrl: { type: String, default: "", trim: true, maxlength: 500 },
    placement: {
      type: String,
      enum: ["homepage", "category", "product", "campaign"],
      default: "homepage",
    },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

marketingBannerSchema.index({ placement: 1, isActive: 1, order: 1 });

module.exports = mongoose.model("MarketingBanner", marketingBannerSchema);

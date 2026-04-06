const mongoose = require("mongoose");

const cmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    content: { type: String, default: "", trim: true },
    seoTitle: { type: String, default: "", trim: true, maxlength: 180 },
    seoDescription: { type: String, default: "", trim: true, maxlength: 360 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    pageType: {
      type: String,
      enum: ["static", "homepage", "blog", "faq", "landing"],
      default: "static",
    },
  },
  { timestamps: true },
);

cmsPageSchema.index({ status: 1, pageType: 1, updatedAt: -1 });

module.exports = mongoose.model("CmsPage", cmsPageSchema);

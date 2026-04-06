const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: "",
    },
    vendorReply: {
      message: {
        type: String,
        trim: true,
        maxlength: 1200,
        default: "",
      },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      repliedAt: Date,
    },
    vendorReaction: {
      type: String,
      enum: ["none", "like", "love", "thanks"],
      default: "none",
    },
    moderationStatus: {
      type: String,
      enum: ["visible", "hidden", "flagged"],
      default: "visible",
    },
    moderationReason: {
      type: String,
      trim: true,
      maxlength: 400,
      default: "",
    },
    abuseReportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ product: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);

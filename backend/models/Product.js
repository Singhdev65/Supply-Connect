const mongoose = require("mongoose");
const {
  PRODUCT_CATEGORY_VALUES,
  PRODUCT_SUBCATEGORY_VALUES,
} = require("../config/productCatalog");

const variantSchema = new mongoose.Schema({
  author: String,
  publisher: String,
  language: String,
  edition: String,
  type: String,
  packSize: String,
  grade: String,
  brand: String,
  model: String,
  ram: String,
  storage: String,
  material: String,
  color: String,
  size: String,
  ageGroup: String,
  stock: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: PRODUCT_CATEGORY_VALUES,
      required: true,
      default: "grocery-daily-essentials",
    },

    subcategory: {
      type: String,
      enum: PRODUCT_SUBCATEGORY_VALUES,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },

    variants: [variantSchema],

    // ✅ MULTIPLE IMAGES (URLs from Cloudinary)
    images: {
      type: [String],
      required: true,
    },

    bannerImages: {
      type: [String],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    moderationNotes: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
    },

    searchKeywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

productSchema.index({ moderationStatus: 1, createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ searchKeywords: 1 });

module.exports = mongoose.model("Product", productSchema);

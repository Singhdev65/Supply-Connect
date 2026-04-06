const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLE_VALUES } = require("../config/roles");

const socialProviderSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, trim: true },
    providerUserId: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    recipientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true, default: "" },
    landmark: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true },
);

const recentlyViewedSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    viewedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const sellerProfileSchema = new mongoose.Schema(
  {
    storeName: { type: String, trim: true, default: "" },
    storeDescription: { type: String, trim: true, default: "" },
    storeLogo: { type: String, trim: true, default: "" },
    storeBanner: { type: String, trim: true, default: "" },
    brandingColor: { type: String, trim: true, default: "" },
    policies: { type: String, trim: true, default: "" },
    seoTitle: { type: String, trim: true, default: "" },
    seoDescription: { type: String, trim: true, default: "" },
    kycStatus: {
      type: String,
      enum: ["not_submitted", "pending", "verified", "rejected"],
      default: "verified",
    },
    kycDocumentUrl: { type: String, trim: true, default: "" },
    kycRejectedReason: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ROLE_VALUES, required: true },
    avatarUrl: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    addresses: { type: [addressSchema], default: [] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    recentlyViewed: { type: [recentlyViewedSchema], default: [] },
    socialProviders: { type: [socialProviderSchema], default: [] },
    resetPasswordTokenHash: { type: String, default: "" },
    resetPasswordExpiresAt: { type: Date, default: null },
    sellerProfile: { type: sellerProfileSchema, default: () => ({}) },
    isBlocked: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, trim: true, default: "" },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
    },
    sellerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "approved",
    },
    sellerCommissionRate: { type: Number, default: 0.1, min: 0, max: 1 },
    sellerSubscriptionPlan: { type: String, trim: true, default: "free" },
    adminSubRole: {
      type: String,
      enum: ["none", "super_admin", "finance_admin", "support_admin"],
      default: "none",
    },
    adminPermissions: { type: [String], default: [] },
    lastLoginAt: { type: Date, default: null },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (err) {
    console.error("Hashing error:", err);
    return next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);

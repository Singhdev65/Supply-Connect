const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String, default: "", trim: true },
    byRole: { type: String, enum: ["buyer", "vendor", "system"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const returnRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    requestedAction: {
      type: String,
      enum: ["refund", "replacement"],
      required: true,
      default: "refund",
    },
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "declined",
        "pickup_scheduled",
        "received",
        "replacement_shipped",
        "completed",
      ],
      default: "requested",
    },
    refundStatus: {
      type: String,
      enum: ["not_applicable", "pending", "processed"],
      default: "not_applicable",
    },
    amount: { type: Number, required: true, min: 0 },
    evidenceImages: { type: [String], default: [] },
    vendorNote: { type: String, default: "", trim: true },
    history: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true },
);

returnRequestSchema.index({ buyer: 1, createdAt: -1 });
returnRequestSchema.index({ vendor: 1, createdAt: -1 });
returnRequestSchema.index({ order: 1, product: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);

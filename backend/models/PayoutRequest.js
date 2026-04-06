const mongoose = require("mongoose");

const payoutRequestSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["requested", "approved", "paid", "rejected"],
      default: "requested",
    },
    note: { type: String, trim: true, default: "", maxlength: 500 },
    processedNote: { type: String, trim: true, default: "", maxlength: 500 },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date, default: null },
    settlementFrom: { type: Date, default: null },
    settlementTo: { type: Date, default: null },
    transactionRef: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

payoutRequestSchema.index({ vendor: 1, createdAt: -1 });
payoutRequestSchema.index({ vendor: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("PayoutRequest", payoutRequestSchema);

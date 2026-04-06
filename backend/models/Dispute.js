const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    againstUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    returnRequest: { type: mongoose.Schema.Types.ObjectId, ref: "ReturnRequest", default: null },
    type: {
      type: String,
      enum: ["refund", "return", "seller_payout", "order_issue", "review_abuse", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open",
    },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    details: { type: String, default: "", trim: true, maxlength: 3000 },
    resolution: { type: String, default: "", trim: true, maxlength: 3000 },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

disputeSchema.index({ status: 1, createdAt: -1 });
disputeSchema.index({ raisedBy: 1, createdAt: -1 });

module.exports = mongoose.model("Dispute", disputeSchema);

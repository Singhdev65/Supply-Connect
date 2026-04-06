const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, required: true },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    attachments: { type: [String], default: [] },
  },
  { _id: false, timestamps: true },
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNo: { type: String, required: true, unique: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    subject: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    category: {
      type: String,
      enum: ["general", "payment", "refund", "return", "order", "dispute", "technical"],
      default: "general",
    },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    messages: { type: [messageSchema], default: [] },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true },
);

supportTicketSchema.index({ createdBy: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model("SupportTicket", supportTicketSchema);

const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorRole: { type: String, required: true },
    module: { type: String, required: true, trim: true },
    action: { type: String, required: true, trim: true },
    targetType: { type: String, default: "", trim: true },
    targetId: { type: String, default: "", trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ module: 1, createdAt: -1 });
activityLogSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);

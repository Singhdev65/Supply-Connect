const Joi = require("joi");

exports.createReturnRequestSchema = Joi.object({
  orderId: Joi.string().required(),
  productId: Joi.string().required(),
  reason: Joi.string().trim().min(5).max(500).required(),
  requestedAction: Joi.string().valid("refund", "replacement").default("refund"),
  evidenceImages: Joi.array().items(Joi.string().uri()).max(5).default([]),
});

exports.updateReturnStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "accepted",
      "declined",
      "pickup_scheduled",
      "received",
      "replacement_shipped",
      "completed",
    )
    .required(),
  vendorNote: Joi.string().trim().max(500).allow("").optional(),
  refundStatus: Joi.string().valid("not_applicable", "pending", "processed").optional(),
});

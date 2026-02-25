const Joi = require("joi");

exports.createConversationSchema = Joi.object({
  participantId: Joi.string().required(),
  orderId: Joi.string().optional().allow(null),
});

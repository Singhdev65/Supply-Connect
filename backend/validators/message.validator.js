const Joi = require("joi");

exports.sendMessageSchema = Joi.object({
  conversationId: Joi.string().required(),
  text: Joi.string().trim().min(1).max(2000).required(),
});

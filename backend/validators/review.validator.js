const Joi = require("joi");

exports.upsertBuyerReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().allow("").max(120).optional(),
  comment: Joi.string().allow("").max(1200).optional(),
});

exports.vendorRespondSchema = Joi.object({
  replyMessage: Joi.string().allow("").max(1200).optional(),
  vendorReaction: Joi.string()
    .valid("none", "like", "love", "thanks")
    .optional(),
}).or("replyMessage", "vendorReaction");

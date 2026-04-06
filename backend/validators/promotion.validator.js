const Joi = require("joi");

const objectIdLike = Joi.string().trim().min(8).required();

exports.createPromotionSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).required(),
  description: Joi.string().trim().max(500).allow("").optional(),
  code: Joi.string().trim().alphanum().min(4).max(20).uppercase().required(),
  discountType: Joi.string().valid("percentage", "fixed").required(),
  discountValue: Joi.number().positive().required(),
  maxDiscount: Joi.number().min(0).default(0),
  minOrderValue: Joi.number().min(0).default(0),
  scope: Joi.string().valid("all", "products", "categories").default("all"),
  productIds: Joi.array().items(objectIdLike).default([]),
  categories: Joi.array().items(Joi.string().trim().min(2).max(80)).default([]),
  usageLimit: Joi.number().integer().min(0).default(0),
  perUserLimit: Joi.number().integer().min(1).default(1),
  startsAt: Joi.date().required(),
  endsAt: Joi.date().greater(Joi.ref("startsAt")).required(),
  isActive: Joi.boolean().default(true),
  autoApply: Joi.boolean().default(false),
});

exports.updatePromotionSchema = exports.createPromotionSchema.fork(["code"], (schema) =>
  schema.optional(),
);

exports.validatePromotionForCartSchema = Joi.object({
  code: Joi.string().trim().uppercase().max(20).required(),
  items: Joi.array()
    .items(
      Joi.object({
        product: objectIdLike,
        qty: Joi.number().integer().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

const Joi = require("joi");

const variantSchema = Joi.object({
  color: Joi.string().optional(),
  size: Joi.string().optional(),
  stock: Joi.number().min(0).required(),
});

exports.addProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().allow("").optional(),

  price: Joi.number().positive().required(),

  stock: Joi.number().min(0).required(),

  variants: Joi.array().items(variantSchema).optional(),

  images: Joi.array().items(Joi.string().uri()).min(1).required(),

  isPublished: Joi.boolean().optional(),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  description: Joi.string().allow("").optional(),

  price: Joi.number().positive().optional(),

  stock: Joi.number().min(0).optional(),

  variants: Joi.array().items(variantSchema).optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),

  isPublished: Joi.boolean().optional(),
});

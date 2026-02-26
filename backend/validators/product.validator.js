const Joi = require("joi");
const {
  PRODUCT_CATEGORY_VALUES,
  PRODUCT_SUBCATEGORY_VALUES,
  isValidSubcategoryForCategory,
} = require("../config/productCatalog");

const variantSchema = Joi.object({
  author: Joi.string().allow("").optional(),
  publisher: Joi.string().allow("").optional(),
  language: Joi.string().allow("").optional(),
  edition: Joi.string().allow("").optional(),
  type: Joi.string().allow("").optional(),
  packSize: Joi.string().allow("").optional(),
  grade: Joi.string().allow("").optional(),
  brand: Joi.string().allow("").optional(),
  model: Joi.string().allow("").optional(),
  ram: Joi.string().allow("").optional(),
  storage: Joi.string().allow("").optional(),
  material: Joi.string().allow("").optional(),
  color: Joi.string().optional(),
  size: Joi.string().optional(),
  ageGroup: Joi.string().allow("").optional(),
  stock: Joi.number().min(0).optional(),
});

exports.addProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  category: Joi.string()
    .valid(...PRODUCT_CATEGORY_VALUES)
    .required(),
  subcategory: Joi.string()
    .valid(...PRODUCT_SUBCATEGORY_VALUES)
    .required(),

  description: Joi.string().allow("").optional(),

  price: Joi.number().positive().required(),

  stock: Joi.number().min(0).required(),

  variants: Joi.array().items(variantSchema).optional(),

  images: Joi.array().items(Joi.string().uri()).min(1).required(),

  bannerImages: Joi.array().items(Joi.string().uri()).min(1).optional(),

  isPublished: Joi.boolean().optional(),
}).custom((value, helpers) => {
  if (!isValidSubcategoryForCategory(value.category, value.subcategory)) {
    return helpers.message("Subcategory must belong to selected category");
  }
  return value;
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  category: Joi.string()
    .valid(...PRODUCT_CATEGORY_VALUES)
    .optional(),
  subcategory: Joi.string()
    .valid(...PRODUCT_SUBCATEGORY_VALUES)
    .optional(),

  description: Joi.string().allow("").optional(),

  price: Joi.number().positive().optional(),

  stock: Joi.number().min(0).optional(),

  variants: Joi.array().items(variantSchema).optional(),

  images: Joi.array().items(Joi.string().uri()).optional(),

  bannerImages: Joi.array().items(Joi.string().uri()).optional(),

  isPublished: Joi.boolean().optional(),
}).custom((value, helpers) => {
  if (value.category && value.subcategory) {
    if (!isValidSubcategoryForCategory(value.category, value.subcategory)) {
      return helpers.message("Subcategory must belong to selected category");
    }
  }
  return value;
});

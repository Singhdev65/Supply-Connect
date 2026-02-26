const Joi = require("joi");

const phonePattern = /^[0-9+\-() ]{7,20}$/;
const postalCodePattern = /^[A-Za-z0-9\- ]{3,12}$/;

const addressSchema = Joi.object({
  label: Joi.string().max(30).allow("").optional(),
  recipientName: Joi.string().trim().min(2).max(80).required(),
  phone: Joi.string().trim().pattern(phonePattern).required(),
  line1: Joi.string().trim().min(3).max(120).required(),
  line2: Joi.string().trim().max(120).allow("").optional(),
  landmark: Joi.string().trim().max(120).allow("").optional(),
  city: Joi.string().trim().min(2).max(80).required(),
  state: Joi.string().trim().min(2).max(80).required(),
  postalCode: Joi.string().trim().pattern(postalCodePattern).required(),
  country: Joi.string().trim().min(2).max(80).default("India"),
  isDefault: Joi.boolean().optional(),
});

exports.updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  phone: Joi.string().trim().pattern(phonePattern).allow("").optional(),
  avatarUrl: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().pattern(/^data:image\/[a-zA-Z+]+;base64,/))
    .allow("")
    .optional(),
  bio: Joi.string().trim().max(300).allow("").optional(),
});

exports.createAddressSchema = addressSchema;

exports.updateAddressSchema = addressSchema.keys({
  isDefault: Joi.boolean().optional(),
});

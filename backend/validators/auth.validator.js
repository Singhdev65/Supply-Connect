const Joi = require("joi");

exports.signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).max(100).required(),

  role: Joi.string().valid("vendor", "buyer").required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

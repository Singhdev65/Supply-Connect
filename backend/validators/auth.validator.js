const Joi = require("joi");
const { PUBLIC_SIGNUP_ROLES } = require("../config/roles");

exports.signupSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).max(100).required(),

  role: Joi.string()
    .valid(...PUBLIC_SIGNUP_ROLES)
    .required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

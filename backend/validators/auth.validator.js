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

exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

exports.resetPasswordSchema = Joi.object({
  token: Joi.string().min(12).required(),
  password: Joi.string().min(6).max(100).required(),
});

exports.socialLoginSchema = Joi.object({
  provider: Joi.string().valid("google", "facebook").required(),
  providerUserId: Joi.string().trim().min(3).required(),
  email: Joi.string().email().required(),
  name: Joi.string().trim().min(2).max(100).required(),
  role: Joi.string()
    .valid(...PUBLIC_SIGNUP_ROLES)
    .default(PUBLIC_SIGNUP_ROLES[0]),
  avatarUrl: Joi.string().uri().allow(""),
});

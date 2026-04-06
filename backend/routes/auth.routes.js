const express = require("express");
const router = express.Router();

const { authController } = require("../controllers");
const validate = require("../middleware/validate");
const { auth: authValidator } = require("../validators");

router.post(
  "/signup",
  validate(authValidator.signupSchema),
  authController.signup,
);

router.post(
  "/login",
  validate(authValidator.loginSchema),
  authController.login,
);

router.post(
  "/forgot-password",
  validate(authValidator.forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validate(authValidator.resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  "/social-login",
  validate(authValidator.socialLoginSchema),
  authController.socialLogin,
);

module.exports = router;

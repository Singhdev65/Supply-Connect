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

module.exports = router;

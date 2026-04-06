const { authService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.signup = asyncHandler(async (req, res) => {
  const data = await authService.signup(req.body);
  return success(res, "Account created successfully", data, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  return success(res, "Login successful", data);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body);
  return success(res, "If the account exists, reset instructions have been generated", data);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.body);
  return success(res, "Password reset successful", data);
});

exports.socialLogin = asyncHandler(async (req, res) => {
  const data = await authService.socialLogin(req.body);
  return success(res, "Social login successful", data);
});

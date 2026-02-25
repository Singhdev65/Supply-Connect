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

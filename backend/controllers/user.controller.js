const { userService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getMyProfile = asyncHandler(async (req, res) => {
  const data = await userService.getMyProfile(req.user);
  return success(res, "Profile fetched", data);
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
  const data = await userService.updateMyProfile(req.user, req.body);
  return success(res, "Profile updated", data);
});

exports.addAddress = asyncHandler(async (req, res) => {
  const data = await userService.addAddress(req.user, req.body);
  return success(res, "Address added", data, 201);
});

exports.updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  if (!addressId) throw new AppError("Address id is required", 400);
  const data = await userService.updateAddress(req.user, addressId, req.body);
  return success(res, "Address updated", data);
});

exports.deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  if (!addressId) throw new AppError("Address id is required", 400);
  const data = await userService.deleteAddress(req.user, addressId);
  return success(res, "Address deleted", data);
});

exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  if (!addressId) throw new AppError("Address id is required", 400);
  const data = await userService.setDefaultAddress(req.user, addressId);
  return success(res, "Default address updated", data);
});

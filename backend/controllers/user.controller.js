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

exports.getWishlist = asyncHandler(async (req, res) => {
  const data = await userService.getWishlist(req.user);
  return success(res, "Wishlist fetched", data);
});

exports.addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new AppError("Product id is required", 400);
  const data = await userService.addToWishlist(req.user, productId);
  return success(res, "Wishlist updated", data);
});

exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new AppError("Product id is required", 400);
  const data = await userService.removeFromWishlist(req.user, productId);
  return success(res, "Wishlist updated", data);
});

exports.getRecentlyViewed = asyncHandler(async (req, res) => {
  const data = await userService.getRecentlyViewed(req.user);
  return success(res, "Recently viewed products fetched", data);
});

exports.markRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new AppError("Product id is required", 400);
  const data = await userService.markRecentlyViewed(req.user, productId);
  return success(res, "Recently viewed updated", data);
});

exports.getSellerProfile = asyncHandler(async (req, res) => {
  const data = await userService.getSellerProfile(req.user);
  return success(res, "Seller profile fetched", data);
});

exports.updateSellerProfile = asyncHandler(async (req, res) => {
  const data = await userService.updateSellerProfile(req.user, req.body);
  return success(res, "Seller profile updated", data);
});

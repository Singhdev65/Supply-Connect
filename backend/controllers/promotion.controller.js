const { promotionService } = require("../services");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.createPromotion = asyncHandler(async (req, res) => {
  const data = await promotionService.createPromotion(req.body, req.user);
  return success(res, "Promotion created", data, 201);
});

exports.listVendorPromotions = asyncHandler(async (req, res) => {
  const data = await promotionService.listVendorPromotions(req.user);
  return success(res, "Vendor promotions fetched", data);
});

exports.updatePromotion = asyncHandler(async (req, res) => {
  const data = await promotionService.updatePromotion(req.params.id, req.body, req.user);
  return success(res, "Promotion updated", data);
});

exports.togglePromotion = asyncHandler(async (req, res) => {
  const data = await promotionService.togglePromotion(req.params.id, req.user);
  return success(res, "Promotion status updated", data);
});

exports.deletePromotion = asyncHandler(async (req, res) => {
  const data = await promotionService.deletePromotion(req.params.id, req.user);
  return success(res, "Promotion archived", data);
});

exports.listActiveDeals = asyncHandler(async (_req, res) => {
  const data = await promotionService.listActiveDeals();
  return success(res, "Active deals fetched", data);
});

exports.validatePromotionForCart = asyncHandler(async (req, res) => {
  const data = await promotionService.validatePromotionForCart(req.body, req.user);
  return success(res, "Promotion validated", data);
});

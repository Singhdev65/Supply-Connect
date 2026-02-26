const { reviewService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new AppError("Product ID is required", 400);

  const data = await reviewService.getProductReviews(productId, req.user);
  return success(res, "Product reviews fetched", data);
});

exports.upsertBuyerReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) throw new AppError("Product ID is required", 400);

  const data = await reviewService.upsertBuyerReview(productId, req.body, req.user);
  return success(res, "Review saved", data);
});

exports.respondToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  if (!reviewId) throw new AppError("Review ID is required", 400);

  const data = await reviewService.respondToReview(reviewId, req.body, req.user);
  return success(res, "Review response saved", data);
});

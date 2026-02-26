const { productService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getProducts = asyncHandler(async (req, res) => {
  const data = await productService.getProducts(req.user, req.query);
  return success(res, "Products fetched", data);
});

exports.getProductCategories = asyncHandler(async (_req, res) => {
  const data = productService.getProductCategories();
  return success(res, "Product categories fetched", data);
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Product ID is required", 400);
  }

  const data = await productService.getProductById(id, req.user);
  return success(res, "Product fetched", data);
});

exports.addProduct = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError("Product data is required", 400);
  }

  const data = await productService.addProduct(req.body, req.user);

  return success(res, "Product added", data, 201);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Product ID is required", 400);
  }

  const data = await productService.updateProduct(id, req.body, req.user);

  return success(res, "Product updated", data);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Product ID is required", 400);
  }

  await productService.deleteProduct(id, req.user);

  return success(res, "Product deleted");
});

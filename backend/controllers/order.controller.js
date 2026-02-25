const { orderService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.placeOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Order items are required", 400);
  }

  const data = await orderService.placeOrder(items, req.user);

  return success(res, "Order placed", data, 201);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const data = await orderService.getOrders(req.user);
  return success(res, "Orders fetched", data);
});

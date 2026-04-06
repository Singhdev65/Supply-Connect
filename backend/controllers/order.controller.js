const { orderService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.placeOrder = asyncHandler(async (req, res) => {
  const { items, addressId, deliveryNotes, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError("Order items are required", 400);
  }
  if (!addressId) {
    throw new AppError("Delivery address is required", 400);
  }

  const data = await orderService.placeOrder(
    { items, addressId, deliveryNotes, couponCode },
    req.user,
  );

  return success(res, "Order placed", data, 201);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const data = await orderService.getOrders(req.user);
  return success(res, "Orders fetched", data);
});

exports.getVendorSalesReport = asyncHandler(async (req, res) => {
  const days = Number(req.query.days || 30);
  const data = await orderService.getVendorSalesReport(req.user, { days });
  return success(res, "Vendor sales report fetched", data);
});

exports.updateVendorOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const data = await orderService.updateVendorOrderStatus(id, status, req.user);
  return success(res, "Order status updated", data);
});

exports.cancelBuyerOrder = asyncHandler(async (req, res) => {
  const data = await orderService.cancelBuyerOrder(
    req.params.id,
    req.user,
    req.body?.reason || "",
  );
  return success(res, "Order cancelled", data);
});

exports.reorder = asyncHandler(async (req, res) => {
  const data = await orderService.reorder(req.params.id, req.user);
  return success(res, "Reorder placed", data, 201);
});

exports.getOrderTracking = asyncHandler(async (req, res) => {
  const data = await orderService.getOrderTracking(req.params.id, req.user);
  return success(res, "Order tracking fetched", data);
});

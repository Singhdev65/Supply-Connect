const { paymentService } = require("../services");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.createPayment = asyncHandler(async (req, res) => {
  const { orderId, method } = req.body;

  const data = await paymentService.createPayment(orderId, method, req.user);

  return success(res, "Payment created", data);
});

exports.confirmCOD = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const data = await paymentService.confirmCOD(orderId, req.user);

  return success(res, "COD confirmed", data);
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  const data = await paymentService.verifyPayment(paymentId);

  return success(res, "Payment verified", data);
});

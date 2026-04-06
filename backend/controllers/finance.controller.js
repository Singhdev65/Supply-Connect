const { financeService } = require("../services");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.getFinanceSummary = asyncHandler(async (req, res) => {
  const data = await financeService.getFinanceSummary(req.user, req.query);
  return success(res, "Finance summary fetched", data);
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const data = await financeService.getTransactions(req.user, req.query);
  return success(res, "Finance transactions fetched", data);
});

exports.getPayouts = asyncHandler(async (req, res) => {
  const data = await financeService.getPayouts(req.user);
  return success(res, "Payout history fetched", data);
});

exports.requestPayout = asyncHandler(async (req, res) => {
  const data = await financeService.requestPayout(req.user, req.body);
  return success(res, "Payout request submitted", data, 201);
});

exports.getTaxReport = asyncHandler(async (req, res) => {
  const data = await financeService.getTaxReport(req.user, req.query);
  return success(res, "Tax report fetched", data);
});

const { returnService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.createReturnRequest = asyncHandler(async (req, res) => {
  const data = await returnService.createRequest(req.body, req.user);
  return success(res, "Return request created", data, 201);
});

exports.getBuyerReturnRequests = asyncHandler(async (req, res) => {
  const data = await returnService.getBuyerRequests(req.user);
  return success(res, "Return requests fetched", data);
});

exports.getVendorReturnRequests = asyncHandler(async (req, res) => {
  const data = await returnService.getVendorRequests(req.user);
  return success(res, "Vendor return requests fetched", data);
});

exports.updateVendorReturnStatus = asyncHandler(async (req, res) => {
  const data = await returnService.updateVendorStatus(req.params.id, req.body, req.user);
  return success(res, "Return request updated", data);
});

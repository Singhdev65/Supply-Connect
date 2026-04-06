const { PayoutRequest } = require("../models");
const mongoose = require("mongoose");

exports.create = (payload) => PayoutRequest.create(payload);

exports.findByVendor = (vendorId) =>
  PayoutRequest.find({ vendor: vendorId }).sort({ createdAt: -1 });

exports.findByVendorAndStatuses = (vendorId, statuses = []) =>
  PayoutRequest.find({
    vendor: vendorId,
    ...(statuses.length ? { status: { $in: statuses } } : {}),
  }).sort({ createdAt: -1 });

exports.totalPaidByVendor = async (vendorId) => {
  const row = await PayoutRequest.aggregate([
    { $match: { vendor: new mongoose.Types.ObjectId(vendorId), status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return Number(row?.[0]?.total || 0);
};

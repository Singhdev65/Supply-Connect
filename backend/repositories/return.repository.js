const { ReturnRequest } = require("../models");

exports.create = (data) => ReturnRequest.create(data);

exports.findByBuyer = (buyerId) =>
  ReturnRequest.find({ buyer: buyerId })
    .populate("order", "status createdAt")
    .populate("product", "name images")
    .sort({ createdAt: -1 });

exports.findByVendor = (vendorId) =>
  ReturnRequest.find({ vendor: vendorId })
    .populate("order", "status createdAt")
    .populate("product", "name images")
    .populate("buyer", "name email")
    .sort({ createdAt: -1 });

exports.findById = (id) =>
  ReturnRequest.findById(id)
    .populate("order")
    .populate("product")
    .populate("buyer", "name email")
    .populate("vendor", "name email");

exports.findByComposite = ({ orderId, productId, buyerId }) =>
  ReturnRequest.findOne({
    order: orderId,
    product: productId,
    buyer: buyerId,
  });

exports.save = (doc) => doc.save();

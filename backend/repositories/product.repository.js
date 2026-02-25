const { Product } = require("../models");

exports.findVendorProducts = (vendorId) =>
  Product.find({ vendor: vendorId })
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });

exports.findPublishedProducts = () =>
  Product.find({ isPublished: true })
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });

exports.findById = (id) => Product.findById(id);

exports.create = (data) => Product.create(data);

exports.save = (product) => product.save();

exports.delete = (product) => product.deleteOne();

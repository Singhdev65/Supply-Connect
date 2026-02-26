const { Product } = require("../models");

exports.findVendorProducts = (vendorId) =>
  Product.find({ vendor: vendorId })
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });

exports.findPublishedProducts = () =>
  Product.find({ isPublished: true })
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });

exports.findVendorProductsPaginated = async (vendorId, { page, limit }) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Product.find({ vendor: vendorId })
      .populate("vendor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ vendor: vendorId }),
  ]);

  return { data, total };
};

exports.findPublishedProductsPaginated = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Product.find({ isPublished: true })
      .populate("vendor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ isPublished: true }),
  ]);

  return { data, total };
};

exports.findByIdForViewer = (id) =>
  Product.findById(id).populate("vendor", "name email");

exports.findById = (id) => Product.findById(id);

exports.create = (data) => Product.create(data);

exports.save = (product) => product.save();

exports.delete = (product) => product.deleteOne();

const { Product } = require("../models");

const buildPublicProductFilter = (filters = {}) => {
  const query = { isPublished: true, moderationStatus: "approved" };

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.category) query.category = filters.category;
  if (filters.subcategory) query.subcategory = filters.subcategory;
  if (Number.isFinite(filters.minPrice)) query.price = { ...(query.price || {}), $gte: filters.minPrice };
  if (Number.isFinite(filters.maxPrice)) query.price = { ...(query.price || {}), $lte: filters.maxPrice };
  if (Number.isFinite(filters.minRating)) query.ratingAverage = { $gte: filters.minRating };

  return query;
};

const buildSort = (sortBy = "newest") => {
  switch (sortBy) {
    case "price_asc":
      return { price: 1, createdAt: -1 };
    case "price_desc":
      return { price: -1, createdAt: -1 };
    case "rating":
      return { ratingAverage: -1, ratingCount: -1, createdAt: -1 };
    case "name":
      return { name: 1 };
    case "oldest":
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

exports.findVendorProducts = (vendorId) =>
  Product.find({ vendor: vendorId })
    .populate("vendor", "name email")
    .sort({ createdAt: -1 });

exports.findPublishedProducts = (filters = {}) =>
  Product.find(buildPublicProductFilter(filters))
    .populate("vendor", "name email")
    .sort(buildSort(filters.sortBy));

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

exports.findPublishedProductsPaginated = async ({ page, limit, ...filters }) => {
  const skip = (page - 1) * limit;
  const query = buildPublicProductFilter(filters);
  const sort = buildSort(filters.sortBy);
  const [data, total] = await Promise.all([
    Product.find(query)
      .populate("vendor", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return { data, total };
};

exports.findByIdForViewer = (id) =>
  Product.findById(id).populate("vendor", "name email");

exports.findByIds = (ids = []) =>
  Product.find({ _id: { $in: ids }, isPublished: true, moderationStatus: "approved" })
    .populate("vendor", "name email");

exports.findById = (id) => Product.findById(id);

exports.create = (data) => Product.create(data);

exports.save = (product) => product.save();

exports.delete = (product) => product.deleteOne();

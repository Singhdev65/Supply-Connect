const { Order } = require("../models");
const mongoose = require("mongoose");

exports.create = (data) => Order.create(data);

exports.findById = (id) => Order.findById(id);

exports.findByIdWithRelations = (id) =>
  Order.findById(id)
    .populate("buyer", "name email")
    .populate("items.product", "name images vendor price category ratingAverage ratingCount");

exports.findByBuyer = (buyerId) =>
  Order.find({ buyer: buyerId })
    .populate("items.product", "name images vendor price category ratingAverage ratingCount")
    .sort({ createdAt: -1 });

exports.findByVendor = (vendorId) =>
  Order.find({ "items.vendor": vendorId })
    .populate("buyer", "name email")
    .populate("items.product", "name images vendor price category ratingAverage ratingCount")
    .sort({ createdAt: -1 });

exports.findAll = () =>
  Order.find()
    .populate("items.product", "name images vendor price category ratingAverage ratingCount")
    .sort({ createdAt: -1 });

exports.findByVendorWithinRange = (vendorId, startDate, endDate) =>
  Order.find({
    "items.vendor": vendorId,
    createdAt: { $gte: startDate, $lte: endDate },
  })
    .populate("buyer", "name email")
    .populate("items.product", "name images vendor price category ratingAverage ratingCount")
    .sort({ createdAt: -1 });

exports.update = (id, data) =>
  Order.findByIdAndUpdate(id, data, { new: true })
    .populate("buyer", "name email")
    .populate("items.product", "name images vendor price category ratingAverage ratingCount");

exports.existsBuyerPurchasedProduct = (buyerId, productId, statuses = []) => {
  const query = {
    buyer: buyerId,
    "items.product": productId,
  };

  if (Array.isArray(statuses) && statuses.length) {
    query.status = { $in: statuses };
  }

  return Order.exists(query);
};

exports.countByPromotion = (promotionId) =>
  Order.countDocuments({ "appliedPromotion.promotion": promotionId });

exports.countByPromotionAndBuyer = (promotionId, buyerId) =>
  Order.countDocuments({
    "appliedPromotion.promotion": promotionId,
    buyer: buyerId,
  });

exports.aggregateVendorSalesByDay = (vendorId, startDate, endDate, statuses = []) => {
  const match = {
    "items.vendor": new mongoose.Types.ObjectId(vendorId),
    createdAt: { $gte: startDate, $lte: endDate },
  };

  if (Array.isArray(statuses) && statuses.length) {
    match.status = { $in: statuses };
  }

  return Order.aggregate([
    { $match: match },
    { $unwind: "$items" },
    {
      $match: {
        "items.vendor": new mongoose.Types.ObjectId(vendorId),
      },
    },
    {
      $group: {
        _id: {
          day: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
        },
        revenue: {
          $sum: { $multiply: ["$items.price", "$items.qty"] },
        },
        unitsSold: { $sum: "$items.qty" },
        orderIds: { $addToSet: "$_id" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id.day",
        revenue: 1,
        unitsSold: 1,
        orderCount: { $size: "$orderIds" },
      },
    },
    { $sort: { date: 1 } },
  ]);
};

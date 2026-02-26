const { Review } = require("../models");
const mongoose = require("mongoose");

exports.findByProduct = (productId) =>
  Review.find({ product: productId })
    .populate("reviewer", "name email")
    .populate("vendorReply.repliedBy", "name email")
    .sort({ createdAt: -1 });

exports.findByProductAndReviewer = (productId, reviewerId) =>
  Review.findOne({ product: productId, reviewer: reviewerId });

exports.findByReviewer = (reviewerId) => Review.find({ reviewer: reviewerId }).select("product");

exports.findById = (reviewId) =>
  Review.findById(reviewId)
    .populate("reviewer", "name email")
    .populate("vendorReply.repliedBy", "name email");

exports.create = (data) => Review.create(data);

exports.save = (review) => review.save();

exports.aggregateProductRating = (productId) =>
  Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rating" },
        ratingCount: { $sum: 1 },
        oneStar: {
          $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] },
        },
        twoStar: {
          $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] },
        },
        threeStar: {
          $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] },
        },
        fourStar: {
          $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] },
        },
        fiveStar: {
          $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        ratingAverage: { $round: ["$ratingAverage", 2] },
        ratingCount: 1,
        distribution: {
          1: "$oneStar",
          2: "$twoStar",
          3: "$threeStar",
          4: "$fourStar",
          5: "$fiveStar",
        },
      },
    },
  ]);

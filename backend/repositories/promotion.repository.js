const { Promotion } = require("../models");

exports.create = (payload) => Promotion.create(payload);

exports.findByVendor = (vendorId) =>
  Promotion.find({ vendor: vendorId }).sort({ createdAt: -1 });

exports.findById = (id) => Promotion.findById(id);

exports.findByCode = (code) =>
  Promotion.findOne({ code: String(code || "").trim().toUpperCase() });

exports.findActivePublic = (now = new Date()) =>
  Promotion.find({
    isActive: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now },
  })
    .select("title description code discountType discountValue maxDiscount minOrderValue scope categories startsAt endsAt autoApply")
    .sort({ autoApply: -1, createdAt: -1 });

exports.save = (doc) => doc.save();

const { Payment } = require("../models");

exports.create = (data) => Payment.create(data);

exports.findById = (id) => Payment.findById(id);

exports.findLatestByOrder = (orderId) =>
  Payment.findOne({ order: orderId }).sort({ createdAt: -1 });

exports.findByOrderAndMethod = (orderId, method) =>
  Payment.findOne({ order: orderId, method }).sort({ createdAt: -1 });

exports.update = (id, data) =>
  Payment.findByIdAndUpdate(id, data, { new: true });

const { Order } = require("../models");

exports.create = (data) => Order.create(data);

exports.findByBuyer = (buyerId) =>
  Order.find({ buyer: buyerId }).populate("items.product");

exports.findAll = () => Order.find().populate("items.product");

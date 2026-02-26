const { User } = require("../models");

exports.findByEmail = (email) => User.findOne({ email });

exports.create = (data) => User.create(data);

exports.findById = (id) => User.findById(id);

exports.save = (user) => user.save();

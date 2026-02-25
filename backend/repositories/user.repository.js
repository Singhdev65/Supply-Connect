const { User } = require("../models");

exports.findByEmail = (email) => User.findOne({ email });

exports.create = (data) => User.create(data);

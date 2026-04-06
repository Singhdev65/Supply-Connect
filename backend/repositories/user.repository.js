const { User } = require("../models");

exports.findByEmail = (email) => User.findOne({ email });

exports.findBySocialProvider = ({ provider, providerUserId }) =>
  User.findOne({
    socialProviders: {
      $elemMatch: {
        provider,
        providerUserId,
      },
    },
  });

exports.create = (data) => User.create(data);

exports.findById = (id) => User.findById(id);

exports.findByResetTokenHash = (tokenHash) =>
  User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  });

exports.save = (user) => user.save();

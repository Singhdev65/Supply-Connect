const { Message } = require("../models");

exports.findByConversation = (conversationId) =>
  Message.find({ conversation: conversationId })
    .populate("sender", "name")
    .sort({ createdAt: 1 });

exports.create = (data) => Message.create(data);

exports.markAsRead = (conversationId, userId) =>
  Message.updateMany(
    { conversation: conversationId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } },
  );

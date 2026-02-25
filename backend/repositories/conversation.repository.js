const { Conversation } = require("../models");

exports.findByParticipants = (userId, participantId, orderId) =>
  Conversation.findOne({
    participants: { $all: [userId, participantId] },
    ...(orderId ? { order: orderId } : {}),
  });

exports.create = (data) => Conversation.create(data);

exports.findUserConversations = (userId) =>
  Conversation.find({ participants: userId })
    .populate("participants", "name role")
    .sort({ lastMessageAt: -1 });

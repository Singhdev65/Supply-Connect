const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const mongoose = require("mongoose");

exports.getConversations = async (user) => {
  const userId = user.id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name role")
    .sort({ lastMessageAt: -1 })
    .lean();

  return conversations.map((conv) => ({
    ...conv,
    unreadCount: conv.unreadCounts?.[userId] || 0,
  }));
};

exports.createConversation = async (participantId, orderId, user) => {
  const userId = user.id;

  if (!mongoose.Types.ObjectId.isValid(participantId))
    throw { message: "Invalid participantId", statusCode: 400 };

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, participantId] },
    ...(orderId ? { order: orderId } : { order: null }),
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, participantId],
      order: orderId || null,
      lastMessageAt: new Date(),

      unreadCounts: {
        [userId]: 0,
        [participantId]: 0,
      },
    });
  }

  return conversation;
};

const { messageRepository } = require("../repositories");
const { Conversation } = require("../models");

const eventBus = require("../events/eventBus");
const EVENTS = require("../events/chat.events");

exports.getMessages = (conversationId) =>
  messageRepository.findByConversation(conversationId);

exports.sendMessage = async (conversationId, text, user) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) throw new Error("Conversation not found");

  const senderId = user.id;

  const message = await messageRepository.create({
    conversation: conversationId,
    sender: senderId,
    text,
    readBy: [senderId],
  });

  const populated = await message.populate("sender", "name");

  conversation.participants.forEach((participantId) => {
    const id = participantId.toString();

    if (id === senderId.toString()) return;

    const current = conversation.unreadCounts.get(id) || 0;

    conversation.unreadCounts.set(id, current + 1);
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = populated.createdAt;

  await conversation.save();

  eventBus.emit(EVENTS.MESSAGE_CREATED, populated);

  return populated;
};

exports.markAsRead = async (conversationId, user) => {
  const userId = user.id;

  await messageRepository.markAsRead(conversationId, userId);

  await Conversation.findByIdAndUpdate(conversationId, {
    [`unreadCounts.${userId}`]: 0,
  });

  eventBus.emit(EVENTS.MESSAGE_READ, {
    conversationId,
    userId,
  });
};

const { messageService } = require("../services");
const { success } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  const data = await messageService.getMessages(conversationId);

  return success(res, "Messages fetched successfully", data);
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text } = req.body;

  if (!conversationId || !text) {
    throw new AppError("Conversation and text required", 400);
  }

  const data = await messageService.sendMessage(conversationId, text, req.user);

  return success(res, "Message sent successfully", data, 201);
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  if (!conversationId) {
    throw new AppError("Conversation ID is required", 400);
  }

  await messageService.markAsRead(conversationId, req.user);

  return success(res, "Messages marked as read");
});

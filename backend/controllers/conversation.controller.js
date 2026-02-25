const { conversationService } = require("../services");
const { success, error } = require("../utils/apiResponse");

exports.getConversations = async (req, res) => {
  try {
    const data = await conversationService.getConversations(req.user);
    return success(res, "Conversations fetched successfully", data);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

exports.createConversation = async (req, res) => {
  try {
    const { participantId, orderId } = req.body;

    if (!participantId) return error(res, "Participant is required", 400);
    if (participantId === req.user.id)
      return error(res, "Cannot create conversation with yourself", 400);

    const data = await conversationService.createConversation(
      participantId,
      orderId,
      req.user,
    );

    return success(res, "Conversation ready", data, 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
};

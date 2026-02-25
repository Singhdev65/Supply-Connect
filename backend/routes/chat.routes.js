const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const { messageController } = require("../controllers");
const { message } = require("../validators");

router.get("/:conversationId", auth(), messageController.getMessages);

router.post(
  "/",
  auth(),
  validate(message.sendMessageSchema),
  messageController.sendMessage,
);

router.put("/read/:conversationId", auth(), messageController.markAsRead);

module.exports = router;

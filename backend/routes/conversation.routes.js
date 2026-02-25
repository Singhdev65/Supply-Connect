const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { conversationController } = require("../controllers");

router.get("/", auth(), conversationController.getConversations);

router.post("/", auth(), conversationController.createConversation);

module.exports = router;

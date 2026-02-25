const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const conversationRoutes = require("./conversation.routes");
const chatRoutes = require("./chat.routes");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", chatRoutes);

module.exports = router;

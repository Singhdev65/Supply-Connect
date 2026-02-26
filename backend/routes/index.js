const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const conversationRoutes = require("./conversation.routes");
const chatRoutes = require("./chat.routes");
const paymantRoutes = require("./payment.routes");
const reviewRoutes = require("./review.routes");
const userRoutes = require("./user.routes");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", chatRoutes);
router.use("/payments", paymantRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);

module.exports = router;

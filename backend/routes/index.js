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
const returnRoutes = require("./return.routes");
const promotionRoutes = require("./promotion.routes");
const financeRoutes = require("./finance.routes");
const adminRoutes = require("./admin.routes");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", chatRoutes);
router.use("/payments", paymantRoutes);
router.use("/reviews", reviewRoutes);
router.use("/users", userRoutes);
router.use("/returns", returnRoutes);
router.use("/promotions", promotionRoutes);
router.use("/finance", financeRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

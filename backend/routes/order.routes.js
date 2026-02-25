const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const { orderController } = require("../controllers");
const { order } = require("../validators");

router.post(
  "/",
  auth(["buyer"]),
  validate(order.placeOrderSchema),
  orderController.placeOrder,
);

router.get("/", auth(), orderController.getOrders);

module.exports = router;

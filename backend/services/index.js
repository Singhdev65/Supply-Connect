const authService = require("./auth.service");
const productService = require("./product.service");
const orderService = require("./order.service");
const conversationService = require("./conversation.service");
const messageService = require("./message.service");
const paymentService = require("./payment.service");
const reviewService = require("./review.service");
const userService = require("./user.service");
const returnService = require("./return.service");
const promotionService = require("./promotion.service");
const financeService = require("./finance.service");
const adminService = require("./admin.service");
const activityLogService = require("./activityLog.service");

module.exports = {
  authService,
  productService,
  orderService,
  conversationService,
  messageService,
  paymentService,
  reviewService,
  userService,
  returnService,
  promotionService,
  financeService,
  adminService,
  activityLogService,
};

const userRepository = require("./user.repository");
const productRepository = require("./product.repository");
const orderRepository = require("./order.repository");
const conversationRepository = require("./conversation.repository");
const messageRepository = require("./message.repository");
const paymentRepository = require("./payment.repository");
const reviewRepository = require("./review.repository");
const returnRepository = require("./return.repository");
const promotionRepository = require("./promotion.repository");
const payoutRepository = require("./payout.repository");

module.exports = {
  userRepository,
  productRepository,
  orderRepository,
  conversationRepository,
  messageRepository,
  paymentRepository,
  reviewRepository,
  returnRepository,
  promotionRepository,
  payoutRepository,
};

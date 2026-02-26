const auth = require("./auth.validator");
const product = require("./product.validator");
const order = require("./order.validator");
const message = require("./message.validator");
const conversation = require("./conversation.validator");
const review = require("./review.validator");
const user = require("./user.validator");

module.exports = {
  auth,
  product,
  order,
  message,
  conversation,
  review,
  user,
};

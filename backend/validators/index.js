const auth = require("./auth.validator");
const product = require("./product.validator");
const order = require("./order.validator");
const message = require("./message.validator");
const conversation = require("./conversation.validator");

module.exports = {
  auth,
  product,
  order,
  message,
  conversation,
};

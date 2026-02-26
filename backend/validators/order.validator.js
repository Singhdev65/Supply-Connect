const Joi = require("joi");

exports.placeOrderSchema = Joi.object({
  addressId: Joi.string().required(),
  deliveryNotes: Joi.string().trim().max(300).allow("").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        qty: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

exports.updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "Accepted by Vendor",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    )
    .required(),
});

const Joi = require("joi");

exports.placeOrderSchema = Joi.object({
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

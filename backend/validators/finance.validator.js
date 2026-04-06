const Joi = require("joi");

exports.requestPayoutSchema = Joi.object({
  amount: Joi.number().positive().required(),
  note: Joi.string().trim().max(500).allow("").optional(),
});

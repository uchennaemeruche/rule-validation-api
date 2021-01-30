const joi = require("joi");
exports.validationSchema = joi
  .object({
    rule: joi
      .object({
        field: joi.any().required().messages({
          "string.base": `field should be a string.`,
          "any.required": `field is required.`,
          "string.empty": `field is required.`,
        }),
        condition: joi.string().required().messages({
          "string.base": `condition should be a string.`,
          "any.required": `condition is required.`,
          "string.empty": `condition is required.`,
        }),
        condition_value: joi.any().disallow("").required().messages({
          "any.required": `condition_value is required.`,
          "any.invalid": `condition_value is required.`,
        }),
      })
      .required()
      .messages({
        "any.required": `rule is required.`,
        "object.base": `rule should be an object.`,
      }),
    data: joi
      .alternatives()
      .try(joi.object(), joi.array(), joi.string())
      .required()
      .messages({
        "string.empty": `data is required.`,
        "any.required": `data is required.`,
        "alternatives.types": `data should be one of [object, array, string].`,
      })
      .messages({
        "object.base": "Invalid JSON payload passed.",
      }),
  })
  .messages({
    "object.base": `Invalid JSON payload passed.`,
  });

const {
  HttpException,
  checkValidation,
  resolveObj,
} = require("../services/utils");
const { validationSchema } = require("../services/schema");

const getMyDetails = (req, res, _) => {
  res.status(200).json({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Uchenna Emeruche",
      github: "@uchennaemeruche",
      email: "uchennaemeruche@gmail.com",
      mobile: "",
      twitter: "",
    },
  });
};

function validateRule(req, res, next) {
  checkValidation(res, validationSchema.validate(req.body));

  let { rule, data } = req.body;

  let fieldValue =
    typeof data == "object" ? resolveObj(rule.field, data) : data[rule.field];

  if (fieldValue == undefined) {
    throw new HttpException(`field ${rule.field} is missing from data.`);
  }

  const conditions = {
    eq: "==",
    neq: "!=",
    gt: ">",
    gte: ">=",
    contains: "contains",
  };

  if (Object.keys(conditions).indexOf(rule.condition) != -1) {
    const isValid = (
      fv = fieldValue,
      op = rule.condition,
      value = rule.condition_value
    ) => {
      if (op == conditions.contains) return [fv].indexOf(value) != -1;
      else if (op == "gte") return fv >= value;
      else if (op == "gt") return fv > value;
      else return eval(`('${fv}' ${conditions[op]} '${value}')`);
    };

    if (isValid()) {
      return res.status(200).json({
        message: `field ${rule.field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: rule.field,
            field_value: fieldValue,
            condition: rule.condition,
            condition_value: rule.condition_value,
          },
        },
      });
    } else {
      throw new HttpException(`field ${rule.field} failed validation.`, {
        validation: {
          error: true,
          field: rule.field,
          field_value: fieldValue,
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      });
    }
  } else {
    throw new HttpException(
      `condition should be one of [eq, neq, gt, gte, contains].`
    );
  }
}

module.exports = { getMyDetails, validateRule };

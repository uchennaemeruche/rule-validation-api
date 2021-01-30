const logger = require("./logger");

class HttpException extends Error {
  constructor(message, data) {
    super(message);
    this.message = message;
    this.data = data;
  }
}

const checkValidation = (res, schema) => {
  const { error, value } = schema;
  if (error) {
    logger.debug(`[Validation Error]: ${error.message}`);
    throw new HttpException(error.details[0].message);
  }
};

const resolveObj = (field, obj) => {
  return field.split(".").reduce((prev, curr, index) => {
    if (index >= 2) return false;
    return prev ? prev[curr] : null;
  }, obj || self);
};

const errorHandler = (error, req, res, next) => {
  let { message, data = null } = error;
  if (error.type == "entity.parse.failed")
    message = "Invalid JSON payload passed.";
  logger.error(`"${message}" `);
  error = {
    status: "error",
    message,
    data,
  };
  return res.status(400).json(error);
};

module.exports = { checkValidation, resolveObj, errorHandler, HttpException };

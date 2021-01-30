const express = require("express");
const cors = require("cors");
const { HttpException, errorHandler } = require("./services/utils");
const { getMyDetails, validateRule } = require("./controllers/routeController");
const httpLogger = require("./services/httpLogger");

const app = express();

app.use(httpLogger);

/*
NB: I allowed all origins as I do not know the origin from which this service will be called.
*/
app.use(cors());
app.options("*", cors());

app.get("/", getMyDetails);

app.post("/validate-rule", express.json(), validateRule);

app.all("*", (req, res, next) => {
  const err = new HttpException("OOps!, Seems the endpoint is unavailable.");
  next(err);
});

app.use(errorHandler);

module.exports = app;

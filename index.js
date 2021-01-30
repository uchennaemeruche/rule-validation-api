const app = require("./app");
const logger = require("./services/logger");
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`App running on PORT: ${PORT}.`);
});

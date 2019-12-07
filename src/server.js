const fs = require("fs");
const mongoose = require("mongoose");
const cluster = require("cluster");
const os = require("os");

const app = require("./app");
const config = require("./config");
const logger = require("./library/helpers/loggerHelpers");
const userModule = require("./components").user;
const testRoute = require("./components/users/users.routes");

if (cluster.isMaster) {
  const cpuCoreCount = os.cpus().length;

  for (let index = 0; index < cpuCoreCount; index++) {
    cluster.fork();
  }
} else {
  app.use("/user", userModule.routes);

  userModule.model;
  mongoose
    .connect(config.dbURI, {
      useMongoClient: true
    })
    .then(() => logger.info("MongoDB is Connected"))
    .catch(err => logger.info(err));

  app.listen(config.port, err => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    logger.info(`
      ################################################
        Express Server listening on port: ${config.port}
      ################################################
    `);
  });
}

// Cluster API has a variety of events.
// Here we are creating a new process if a worker die.
cluster.on("exit", function(worker) {
  logger.info(`Worker ${worker.id} died'`);
  logger.info(`Staring a new one...`);
  cluster.fork();
});

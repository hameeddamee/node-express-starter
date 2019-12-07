const dotenv = require("dotenv");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config({ path: "variables.env" });
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  appName: process.env.APP_NAME,
  port: parseInt(process.env.PORT, 10),
  dbURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  tokenType: process.env.JWT_TOKEN_TYPE,
  logs: {
    level: process.env.LOG_LEVEL || "silly"
  },
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10)
  },
  agendash: {
    user: "agendash",
    password: "123456"
  },
  api: {
    prefix: "/api"
  },
  emails: {
    apiKey: "API key from mailgun",
    domain: "Domain Name from mailgun"
  }
};

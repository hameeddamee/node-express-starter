const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "2mb",
    extended: true
  })
);
app.use(cookieParser());
app.use(helmet());
app.set("trust proxy", 1);

module.exports = app;

// /**
//  * User
//  *
//  * @param {String} path user's load path
//  * @return {User} `User` instance
//  * @api public
//  */

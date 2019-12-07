const { FailResponse } = require("../helpers/responseHelpers");
const logger = require("../helpers/loggerHelpers");
const config = require("../../config");
const jwtHelpers = require("../helpers/jwtHelpers");

const userServices = require("../../components").user;

exports.getAuthorize = async (req, res, next) => {
  // Check header or url parameters or post parameters for token
  const headerAuthorize =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization;

  // Check exist token
  if (!headerAuthorize) {
    logger.warn("Header Authorize Not Found");
    return res.json(
      new FailResponse.Builder()
        .withMessage("Header Authorize Not Found")
        .build()
    );
  }

  // Get token
  const token = headerAuthorize.replace(config.tokenType, "").trim();

  // Decode token
  // Verifies secret and checks exp
  try {
    const decoded = await jwtHelpers.decode(token, config.jwtSecret);
    // Save decoded to request
    req.decoded = decoded;
    // Save user current to request
    const email = decoded.payload.email;
    req.currentUser = await userServices.findUserByEmail(email);
    return next();
  } catch (err) {
    logger.error(`Token Decode Error ${err}`);
    return res.status(401).json(
      new FailResponse.Builder()
        .withContent(err.name)
        .withMessage(err.message)
        .build()
    );
  }
};

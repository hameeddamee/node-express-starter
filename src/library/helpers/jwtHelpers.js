const jwt = require("jsonwebtoken");
const config = require("../../config");

exports.encode = payload => {
  let token = jwt.sign({ payload }, config.jwtSecret, { expiresIn: "1h" });
  return token;
};

exports.decode = async token => {
  let decoded = await jwt.verify(token, config.jwtSecret);
  return decoded;
};

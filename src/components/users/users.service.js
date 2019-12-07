const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const User = require("./users.model");
const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const config = require("../../config/");
const { randomPassword } = require("../../library/helpers/stringHelpers");
// const mailHelpers = require("../../library/helpers/mailHelpers");

exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn("Authentication failed. User not found.");
    throw new Error("Authentication failed. User not found.");
  }

  const isValidPassword = await bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    logger.warn("Authentication failed. Wrong password.");
    throw new Error("Authentication failed. Wrong password.");
  }

  let token = jwtHelpers.encode({ email }, config.jwtSecret, {
    expiresIn: "1h"
  });
  logger.info(`Auth token created: ${token}`);

  return { token: `${config.tokenType} ${token}` };
};

exports.confirmResetPassword = async token => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    throw new Error("Password reset is invalid or has expired");
  }

  // Generate new password
  let password = randomPassword();
  const hash = await bcrypt.hashSync(password);
  logger.info(`Password was generated: ${password}`);
  user.password = hash;
  user.resetPassword = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await User.updateOne({ email: user.email }, user);

  return user;
};

exports.confirmSignUp = async token => {
  if (!token) {
    throw new Error("Token Not Found");
  }

  try {
    let decoded = await jwtHelpers.decode(token, keys.jwtSecret);
    let email = decoded.payload.email;

    // Enable user
    let user = await User.findOne({ email });
    user.enable = true;
    await User.updateOne({ email }, user);

    // Create response
    return user;
  } catch (err) {
    logger.error(`Token Decode Error ${err}`);
    throw new Error(`Token Decode Error ${err}`);
  }
};

exports.findUserByEmail = async email => {
  const user = await User.findOne({ email });

  if (!user) {
    logger.warn("Authentication failed. User not found.");
    throw new Error("Authentication failed. User not found.");
  }

  return user;
};

exports.findCurrentUser = async token => {
  // Decode token
  try {
    let decoded = await jwtHelpers.decode(token, config.jwtSecret);
    let email = decoded.payload.email;
    // Find user
    let user = await User.findOne({ email });
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.findAllUsers = async () => {
  const users = await User.find();

  if (!users) {
    logger.warn("No User found.");
    throw new Error("No User found.");
  }

  return users;
};

exports.forgotPassword = async (email, host) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account with that email exists.");
  }

  user.resetPasswordToken = jwtHelpers.encode({ email }, config.jwtSecret, {
    expiresIn: "1h"
  });
  user.resetPasswordExpires = Date.now() + 3600000;

  await User.updateOne({ email }, user);
  const resetURL = `http://${host}/api/confirm-reset-password?token=${user.resetPasswordToken}`;
  // await mailHelpers.send({
  //   user,
  //   filename: "password-reset",
  //   subject: "Password Reset",
  //   resetURL
  // });

  return user;
};

exports.signUp = async (
  firstName,
  lastName,
  phoneNumber,
  email,
  password,
  host
) => {
  let avatar = await gravatar.url(email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm" // Default
  });
  // Save the user
  const user = new User({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    avatar
  });
  await user.save();

  // Send them an email with the token
  const tokenConfirm = jwtHelpers.encode({ email }, config.jwtSecret, {
    expiresIn: "15d"
  });
  const resetURL = `http://${host}/api/confirm-sign-up?token=${tokenConfirm}`;
  // await mailHelpers.send({
  //   user,
  //   filename: "confirm-sign-up",
  //   subject: "Confirm Sign Up",
  //   resetURL
  // });

  return user;
};

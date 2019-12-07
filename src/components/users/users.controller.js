const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require("http-status-codes");

const userService = require("./users.service");
const {
  SuccessResponse,
  FailResponse
} = require("../../library/helpers/responseHelpers");
const { sentenceCase } = require("../../library/helpers/stringHelpers");

/**
 * User
 *
 * @param {String} path user's load path
 * @return {Users} `User` instance
 * @api public
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers();

    return res.json(
      new SuccessResponse.Builder()
        .withContent(users)
        .withMessage("All users successfully loaded")
        .build()
    );
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json(
      new FailResponse.Builder()
        .withContent(err.name)
        .withMessage(err.message)
        .build()
    );
  }
};

exports.postAuthenticate = async (req, res) => {
  try {
    const { email, password } = req.body;

    let token = await userService.authenticate(email, password);

    return res.json(
      new SuccessResponse.Builder()
        .withContent(token)
        .withMessage("User successfully logged In")
        .build()
    );
  } catch (err) {
    return res.status(NOT_FOUND).json(
      new FailResponse.Builder()
        .withContent(err.name)
        .withMessage(err.message)
        .build()
    );
  }
};

exports.postSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    let formattedFirstName = sentenceCase(firstName);
    let formattedLastName = sentenceCase(lastName);

    const user = await userService.signUp(
      formattedFirstName,
      formattedLastName,
      phoneNumber,
      email,
      password,
      req.headers.host
    );

    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .withMessage("User account created successfully")
        .build()
    );
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send(
      new FailResponse.Builder()
        .withContent(err.name)
        .withMessage(err.message)
        .build()
    );
  }
};

exports.getConfirmSignUp = async (req, res) => {
  try {
    const token = req.query.token;
    const user = await userService.confirmSignUp(token);

    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .withMessage("User's signup successfully activated")
        .build()
    );
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(
      new FailResponse.Builder()
        .withContent(error.name)
        .withMessage(error.message)
        .build()
    );
  }
};

exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userService.forgotPassword(email, req.headers.host);

    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .withMessage("You have been emailed a password reset link.")
        .build()
    );
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send(
      new FailResponse.Builder()
        .withContent(error.name)
        .withMessage(error.message)
        .build()
    );
  }
};

exports.getConfirmResetPassword = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await userService.confirmResetPassword(token);

    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .withMessage(`Your password is: ${user.password}`)
        .build()
    );
  } catch (error) {
    return res.status(400).send(
      new FailResponse.Builder()
        .withContent(error.name)
        .withMessage(error.message)
        .build()
    );
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.decoded.payload.email;
    const user = await userService.findCurrentUser(token);

    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .withMessage("Current user successfully loaded")
        .build()
    );
  } catch (error) {
    return res.status(400).send(
      new FailResponse.Builder()
        .withContent(error.name)
        .withMessage(error.message)
        .build()
    );
  }
};

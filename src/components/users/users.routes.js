const express = require("express");
const router = express.Router();

const { catchErrors } = require("../../library/helpers/errorHandlers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");
const userController = require("./users.controller");

// Unprotected User routes
router.get("/", (req, res) => res.json({ msg: process.env.APP_NAME }));
router.post("/authenticate", catchErrors(userController.postAuthenticate));
router.post("/sign-up", catchErrors(userController.postSignUp));
router.get("/confirm-sign-up", catchErrors(userController.getConfirmSignUp));
router.post("/forgot-password", catchErrors(userController.postForgotPassword));
router.get(
  "/confirm-reset-password",
  catchErrors(userController.getConfirmResetPassword)
);

// Protected routes
router.get(
  "/get-user-current",
  getAuthorize,
  catchErrors(userController.getCurrentUser)
);
router.get("/users", getAuthorize, catchErrors(userController.getUsers));
router.get(
  "/test-axios",
  getAuthorize,
  catchErrors(userController.getTestAxios)
);

module.exports = router;

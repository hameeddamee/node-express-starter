const userRoutes = require("./users/users.routes");
const userModel = require("./users/users.model");
const userService = require("../components/users/users.service");

const componentModule = {
  user: {
    routes: userRoutes,
    model: userModel,
    service: userService
  }
};

module.exports = componentModule;

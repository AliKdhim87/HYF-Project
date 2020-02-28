const express = require("express");
const { check } = require("express-validator");
const route = express.Router();

const usersControllers = require("../controllers/users-controllers");

route.get("/", usersControllers.getUsers);

route.post(
  "/signup",
  [
    check("name")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail()
      .isEmail(),
    check("password").isLength({ min: 6 })
  ],
  usersControllers.signup
);

route.post("/login", usersControllers.login);

module.exports = route;

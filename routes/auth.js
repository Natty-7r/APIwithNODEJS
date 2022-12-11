// third party module imports
const router = require("express").Router();
const { body: bodyValidator } = require("express-validator/check");
// const my imports
const authController = require("../controllers/auth");
const User = require("../models/user");

// helper functions
const signupValidator = [
  bodyValidator("name").isLength(3).withMessage("to short name"),
  bodyValidator("password").isLength(4).withMessage("weak password"),
  bodyValidator("email").custom((value, { req }) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) return Promise.reject("user exits");
    });
  }),
];

router.put("/signup", signupValidator, authController.signup);

router.post("/login", signupValidator, authController.login);

module.exports = router;

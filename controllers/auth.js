// third party module imports
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// my imports
const User = require("../models/user");
const user = require("../models/user");
exports.signup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors.array()[0].msg);
    const error = new Error("validation error");
    error.statusCode = 422;
    error.errors = validationErrors.array();
    throw error;
  }
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
      });
      return user.save();
    })
    .then((userSaved) => {
      return res.status(201).json({
        message: "user signed up Successfully ",
        userId: userSaved._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let user;
  User.findOne({ email: email })
    .then((userFound) => {
      user = userFound;
      if (!userFound) {
        const error = new Error("invlaid email !");
        error.statusCode = 401;
        throw error;
      }
      return bcrypt.compare(password, userFound.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("wrong password !");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        "loginsecretekey"
      );
      return res.status(200).json({ token: token, userId: user._id });
    })
    .catch((error) => {
      if (!error.statusCode) error.statusCode = 500;
      next(error);
    });
};

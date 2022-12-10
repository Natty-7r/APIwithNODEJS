// third party module imports
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// my imports
const User = require("../models/user");
const user = require("../models/user");
exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const validationErrors = validationResult(req);
  try {
    if (!validationErrors.isEmpty()) {
      const error = new Error("validation error");
      error.statusCode = 422;
      error.errors = validationErrors.array();
      throw error;
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: hashPassword,
    });
    await user.save();
    return res.status(201).json({
      message: "user signed up Successfully ",
      userId: user._id,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("invlaid email !");
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
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
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

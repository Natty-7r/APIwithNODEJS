const User = require("../models/user");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
module.exports = {
  text() {
    return "hi";
  },
  async createUser({ userInput }, req) {
    const { name, email, password } = userInput;
    let user = User.findOne({ email });
    if (user) {
      const error = new Error("user existss");
      throw error;
    }

    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ messae: "email is invalid !" });
    }
    if (validator.isEmpty(name) || !validator.isLength(name, { min: 5 })) {
      errors.push({ message: "name should be at least five character" });
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 0,
        minLowercase: 1,
        minSymbol: 1,
      })
    ) {
      errors.push({ message: "use strong password " });
    }
    if (errors.length > 0) {
      const error = new Error("validation error!");
      error.code = 422;
      error.data = errors;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 12);
    user = new User({ name, email, password: hashPassword });
    const userSaved = await user.save();

    return {
      ...userSaved._doc,
    };
  },
  async login({ email, password }, req) {
    let user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Invalid Email !");
      error.code = 401;
      throw error;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      const error = new Error("Invalid password !");
      error.code = 401;
      throw error;
    }

    const token = await jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      "loginsecretekey"
    );
    return {
      userId: user._id,
      token: token,
    };
  },
};

// thrid party module imports
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.get("Authorization")) {
    const err = new Error("Not Authorized!");
    err.statusCode = 422;
    throw err;
  }
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "loginsecretekey");
  } catch (err) {
    err.statusCode = 401;
  }
  if (!decodedToken) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    throw err;
  }
  req.userId = decodedToken.userId;
  next();
};

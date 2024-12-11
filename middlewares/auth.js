const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORISED } = require("../utils/errorhandler");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORISED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORISED).send({ message: "Authorization required" });
  }

  req.user = payload; // Add user data to the request
  return next(); // Proceed to the next middleware or route handler
};

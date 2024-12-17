const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

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
    // return res.status(UNAUTHORISED).send({ message: "Authorization required" });
    const error = new Error("Authorisation required");
    error.statusCode = 401;
    next(error);
  }

  req.user = payload; // Add user data to the request
  return next(); // Proceed to the next middleware or route handler
};

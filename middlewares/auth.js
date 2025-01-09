const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorisedError = require("./errors/unauthorised-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorisedError("Authorisation required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // return res.status(UNAUTHORISED).send({ message: "Authorization required" });
    const error = new Error("Authorisation required");
    error.statusCode = 401;
    return next(new UnauthorisedError("Authorisation required"));
  }

  req.user = payload; // Add user data to the request
  return next(); // Proceed to the next middleware or route handler
};

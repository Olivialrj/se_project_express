const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORISED } = require("../utils/errors");

req.user = payload;
next();

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
  req.user = payload;
  next();
};

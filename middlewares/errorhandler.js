const BadRequestError = require("./errors/bad-request-error");
const UnauthorisedError = require("./errors/unauthorised-error");
const ForbiddenError = require("./errors/forbidden-error");
const NotFoundError = require("./errors/not-found-error");
const ConflictError = require("./errors/conflict-error");

const errorHandler = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof UnauthorisedError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // If it's an unknown error, return a 500 Internal Server Error
  return res.status(500).send({
    message: "An unexpected error occurred. Please try again later.",
  });
};

module.exports = errorHandler;

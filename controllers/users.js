const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictError = require("../middlewares/errors/conflict-error");
const BadRequestError = require("../middlewares/errors/bad-request-error");
const UnauthorisedError = require("../middlewares/errors/unauthorised-error");
const NotFoundError = require("../middlewares/errors/not-found-error");

module.exports.createUsers = (req, res, next) => {
  console.log("Received data:", req.body);
  const { email, password, name, avatarUrl } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // return res
        //   .status(CONFLICT)
        //   .send({ message: "User with this email already exists." });
        return next(new ConflictError("User with this email already exists."));
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({ email, password: hashedPassword, name, avatarUrl })
        )
        .then((user) => {
          const userResponse = {
            name: user.name,
            avatarUrl: user.avatar,
            email: user.email,
            _id: user._id,
          };
          return res.status(201).send({ data: userResponse });
        });
    })

    .catch((err) => {
      if (err.code === 11000) {
        // return res.status(CONFLICT).send({ message: "User already exists" });
        return next(new ConflictError("User already exists."));
      }
      if (err.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: `Validation Error: ${err.message}` });
        return next(new BadRequestError(`Validation Error: ${err.message}`));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: "ID is invalid" });
        next(new BadRequestError("ID is invalid"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: `Data was not found` });
        next(new NotFoundError("Data was not found"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
      next(err);
    });
};

module.exports.updateCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatarUrl } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatarUrl },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        // return res.status(NOT_FOUND).send({ message: "User not found" });
        throw new NotFoundError("User not found");
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Internal server error" });
        next(new BadRequestError("Internal server error"));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // return res
    //   .status(BAD_REQUEST)
    //   .send({ message: "Email and password are required" });
    next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Generate a JWT token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        // return res
        //   .status(UNAUTHORISED)
        //   .send({ message: "Invalid email or password" });
        next(new UnauthorisedError("Invalid email or password"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
      next(err);
    });
};

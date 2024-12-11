const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  UNAUTHORISED,
} = require("../utils/errorhandler");

module.exports.createUsers = (req, res) => {
  console.log("Received data:", req.body);
  const { email, password, name, avatarUrl } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(CONFLICT)
          .send({ message: "User with this email already exists." });
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
        return res.status(CONFLICT).send({ message: "User already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `Validation Error: ${err.message}` });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "ID is invalid" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: `Data was not found` });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.updateCurrentUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Internal server error" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
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
          avatarUrl: user.avatarUrl,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORISED)
          .send({ message: "Invalid email or password" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

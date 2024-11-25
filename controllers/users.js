const bcrypt = require("bcrypt.js");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORISED,
} = require("../utils/errors");

module.exports.createUsers = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "User with this email already exists." });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      return User.create({ name, avatar, email, password: hashedPassword });
    })
    .then((user) => {
      const userResponse = {
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      };
      res.status(201).send({ data: userResponse });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(BAD_REQUEST).send({ message: "User already exists" });
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

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
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

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
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
  const userId = req.user._id,
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(userId, {name, avatar})
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  User.findUserbyCredentials(email, password).select('+password')
    .then((user) => {
      return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return res.status(UNAUTHORIZED).send({ message: "Incorrect email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.send({ token }); // Send the token to the client
      });
  })
    .catch((err) => {
      return res
        .status(UNAUTHORISED)
        .send({ message: "Incorrect email or password" });
    });
};

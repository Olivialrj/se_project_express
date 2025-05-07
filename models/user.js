const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  name: {
    // every user has a name field, the requirements for which are described below:
    type: String, // the name is a string
    required: true, // every user has a name, so it's a required field
    minlength: 2, // the minimum length of the name is 2 characters
    maxlength: 30, // the maximum length is 30 characters
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: "Wrong email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUsers } = require("./controllers/users");
const errorHandler = require("./middlewares/errorhandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateUser,
  validateUserInfoBody,
} = require("./middlewares/validation");

const { PORT = 3000 } = process.env;
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/project12-db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.post("/signin", validateUser, login);
app.post("/signup", validateUserInfoBody, createUsers);
app.use("/", mainRouter);

app.use(errorLogger);
// //celebrate error handler
app.use(errors());
// //centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

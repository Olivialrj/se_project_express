const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes");
const { login, createUsers } = require("./controllers/users");

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/project12-db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUsers);
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

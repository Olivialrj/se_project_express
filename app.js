const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/project12-db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use(cors());
app.use("/", mainRouter);
app.post("/signin", login);
app.post("/signup", createUser);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

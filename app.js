const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();
const mainRouter = require("./routes");

mongoose
  .connect("mongodb://127.0.0.1:27017/project12-db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6737cc792721da01871716ab", // paste the _id of the test user created in the previous step
  };
  console.log("Middleware user ID:", req.user._id);
  next();
});

app.use("/", mainRouter);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

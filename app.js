const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes");
const auth = require("./middlewares/auth");
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

// app.use((req, res, next) => {
//   req.user = {
//     _id: "6737cc792721da01871716ab", // paste the _id of the test user created in the previous step
//   };
//   next();
// });

app.use("/", mainRouter);
app.post("/signin", login);
app.post("/signup", creatUser);
app.use(auth);
app.use(sors());
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

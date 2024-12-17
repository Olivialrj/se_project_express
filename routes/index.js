const router = require("express").Router();
const { NOT_FOUND } = require("../middlewares/errorhandler");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingitems");
const likeRouter = require("./likes");

console.log("Setting up /users routes");
router.use("/users", userRouter);

console.log("Setting up /clothingitems routes");
router.use("/items", clothingItemRouter);

console.log("Setting up /likes routes");
router.use("/likes", likeRouter);

// Handle non-existent routes
router.use((req, res) => {
  console.log(`404 Error - Path: ${req.path}`);
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;

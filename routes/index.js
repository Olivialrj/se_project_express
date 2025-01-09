const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingitems");
const likeRouter = require("./likes");
// const NotFoundError = require("../middlewares/errors/not-found-error");

console.log("Setting up /users routes");
router.use("/users", userRouter);

console.log("Setting up /clothingitems routes");
router.use("/items", clothingItemRouter);

console.log("Setting up /likes routes");
router.use("/items", likeRouter);

// Handle non-existent routes
// router.use((req, res) => {
//   console.log(`404 Error - Path: ${req.path}`);
//   return next(new NotFoundError("Router not found"));
// });

module.exports = router;

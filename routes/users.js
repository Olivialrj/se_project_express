const router = require("express").Router();
const auth = require("./middleware/auth.js");
const {
  createUsers,
  getUsers,
  getUser,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/users");
const { login } = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUsers);
// router.post("/login", login);

router.get("/me", auth, getCurrentUser);
router.patch("/me", updateCurrentUser);
module.exports = router;

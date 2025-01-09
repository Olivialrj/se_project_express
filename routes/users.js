const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { validateUserInfo } = require("../middlewares/validation");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUsers);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserInfo, updateCurrentUser);
module.exports = router;

const router = require("express").Router();
const { createUsers, getUsers, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUsers);

module.exports = router;

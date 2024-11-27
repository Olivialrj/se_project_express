const router = require("express").Router();
const auth = require("../middlewares/auth");
const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;

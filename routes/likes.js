const { likeItem, dislikeItem } = require("../controllers/likes");

const router = require("express").Router();

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;

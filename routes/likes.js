const router = require("express").Router();
const auth = require("../middlewares/auth");
const { likeItem, dislikeItem } = require("../controllers/likes");
const { validateID } = require("../middlewares/validation");

router.put("/:itemId/likes", auth, validateID, likeItem);
router.delete("/:itemId/likes", auth, validateID, dislikeItem);

module.exports = router;

// "deploy": "npm run build && scp -r ./dist/* olivialrj97@olivialrj.strangled.net:/home/olivalirj97/frontend",

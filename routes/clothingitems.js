const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItems,
} = require("../controllers/clothingitems");
const {
  validateClothingItemBody,
  validateID,
} = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validateClothingItemBody, createClothingItem);
router.delete("/:itemId", auth, validateID, deleteClothingItems);

module.exports = router;

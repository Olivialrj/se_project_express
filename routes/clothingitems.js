const router = require("express").Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItems,
} = require("../controllers/clothingitems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItems);

module.exports = router;

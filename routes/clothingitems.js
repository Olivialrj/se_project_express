const {
  getClothingItems,
  createClothingItem,
  deleteClothingItems,
} = require("../controllers/clothingitems");

const router = require("express").Router();

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItems);

module.exports = router;

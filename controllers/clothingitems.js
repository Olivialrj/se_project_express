const ClothingItem = require("../models/clothingitem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .then((clothingItems) => res.status(200).send(clothingItems))
    .catch((err) => {
      console.log(err);
      return res.status(SERVER_ERROR).send({ message: err.messge });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageURL } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageURL, owner })
    .then((clothingItem) => res.status(201).send({ data: clothingItem }))
    .catch((err) => {
      console.error("Error creating clothing item:", err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `Validation Error: ${err.message}` });
      }
      res
        .status(SERVER_ERROR)
        .send({ message: `Error creating clothing item: ${err.message}` });
    });
};

module.exports.deleteClothingItems = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((clothingItem) => res.status(200).send(clothingItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

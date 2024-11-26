const { NOT_FOUND, BAD_REQUEST, SERVER_ERROR } = require("../utils/errors");
const ClothingItem = require("../models/clothingitem");

module.exports.likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports.dislikeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // Remove the user ID from the "likes" array
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => {
      console.error("Error disliking item:", err);

      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.statusCode === NOT_FOUND) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

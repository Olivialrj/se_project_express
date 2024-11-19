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
      res
        .status(err.statusCode || SERVER_ERROR)
        .send({ message: err.message || "An error occurred on the server" });
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

      res
        .status(err.statusCode || SERVER_ERROR)
        .send({ message: err.message || "An error occurred on the server" });
    });
};

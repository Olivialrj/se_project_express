const BadRequestError = require("../middlewares/errors/bad-request-error");
const NotFoundError = require("../middlewares/errors/not-found-error");
const ClothingItem = require("../models/clothingitem");

module.exports.likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  console.log("User ID:", userId); // Add this
  console.log("Item ID:", itemId);
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => {
      // const error = new Error("Item not found");
      // error.statusCode = NOT_FOUND;
      // throw error;
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => res.send({ data: updatedItem }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
        return next(new BadRequestError("Invalid item ID"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
      next(err);
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
      // const error = new Error("Item not found");
      // error.statusCode = NOT_FOUND;
      // throw error;
      throw new NotFoundError("Item not found");
    })
    .then((updatedItem) => res.status(200).send({ data: updatedItem }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
        return next(new BadRequestError("Invalid item ID"));
      }
      next(err);
    });
};

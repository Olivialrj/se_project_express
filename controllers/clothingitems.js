const ClothingItem = require("../models/clothingitem");
const BadRequestError = require("../middlewares/errors/bad-request-error");
const NotFoundError = require("../middlewares/errors/not-found-error");
const ForbiddenError = require("../middlewares/errors/forbidden-error");
module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItems) => res.status(200).send(clothingItems))
    .catch((err) => {
      next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(201).send({ data: clothingItem }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: `Validation Error: ${err.message}` });
        return next(new BadRequestError(`Validation Error: ${err.message}`));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
      next(err);
    });
};

module.exports.deleteClothingItems = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.toString() !== userId) {
        // If the logged-in user is not the owner, deny the deletion
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "You are not authorized to delete this item" });
        return next(
          new ForbiddenError("You are not authorised to delet this item")
        );
      }

      // If the user is the owner, delete the item
      return clothingItem
        .deleteOne()
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: "ID is invalid" });
        return next(new BadRequestError("ID is invalid"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: `Data was not found` });
        return next(new NotFoundError("Data was not found"));
      }
      next(err);
    });
};

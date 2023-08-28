const express = require("express");
const favouritesController = require("../controllers/favouritesController");
const auth = require("../middleware/authMidedleware");

const favouritesRouter = express.Router();

favouritesRouter.post(
  "/add",
  auth.verify,
  favouritesController.createFavouriteProduct
);
favouritesRouter.get(
  "/",
  auth.verify,
  favouritesController.getFavouriteProducts
);
favouritesRouter.delete(
  "/:id",
  auth.verify,
  favouritesController.deleteFavouriteProduct
);

module.exports = favouritesRouter;

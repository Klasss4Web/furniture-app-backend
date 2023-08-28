const Favourites = require("../models/favouritesModel");
const userModel = require("../models/userModel");

module.exports = {
  createFavouriteProduct: async (req, res) => {
    const favouriteProduct = new Favourites(req.body);

    try {
      await favouriteProduct.save();
      res.status(200).json({ message: "Product added successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to add the product" });
    }
  },
  getFavouriteProducts: async (req, res) => {
    try {
      // const user = await userModel.findById(req.user._id);
      const usersFavourites = await Favourites.find({ user: req.user._id });
      console.log("FAV", usersFavourites);

      if (usersFavourites.length > 0) {
        res.status(200).json({
          success: true,
          message: "Products successfully fetched",
          products: usersFavourites,
        });
      } else {
        res.status(404);
        throw new Error("No product found");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteFavouriteProduct: async (req, res) => {
    const product = await Favourites.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product removed from list successfully" });
    } else {
      res.status(404);
      throw new Error("Product Not Found");
    }
  },
};

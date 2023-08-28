const mongoose = require("mongoose");
const productsModel = require("./products");

const products = productsModel.ProductSchema;

const FavouritesSchema = mongoose.Schema(
  {
    products: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Products",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Favourites", FavouritesSchema);

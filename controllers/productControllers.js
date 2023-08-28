const productsModel = require("../models/products");
const User = require("../models/userModel");
const Products = productsModel.products;

module.exports = {
  createProduct: async (req, res) => {
    const newProduct = new Products(req.body);

    try {
      await newProduct.save();
      res.status(200).json({ message: "Product created successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to create the product" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { name, price, description, imageUrl, location } = req.body;
      const product = await Products.findById(req.params.id);

      if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.imageUrl = imageUrl || product.imageUrl;
        product.location = location || product.location;

        const updatedProduct = await product.save();
        res.status(200).json({
          success: true,
          message: "Product successfully updated",
          product: updatedProduct,
        });
      } else {
        res.status(404);
        throw new Error("Product not found");
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const product = await Products.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404);
      throw new Error("Product Not Found");
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await Products.find().sort({ createAt: -1 });
      res.status(200).json({
        success: true,
        message: "Products successfully fetched",
        totalProducts: products.length,
        products,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch the product" });
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (product.length > 0) {
        res.status(200).json({
          success: true,
          message: "Product successfully fetched",
          product,
        });
      } else {
        res.status(404).json({
          message: "No product with this id found",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch the product" });
    }
  },

  serachProducts: async (req, res) => {
    try {
      // const result = await Products.aggregate([
      //   {
      //     $search: {
      //       index: "products",
      //       text: {
      //         query: req.params.key,
      //         path: {
      //           wildcard: "*",
      //         },
      //       },
      //     },
      //   },
      // ]);
      const keyword = req.params.key
        ? {
            $or: [
              { location: { $regex: req.params.key, $options: "i" } },
              { name: { $regex: req.params.key, $options: "i" } },
              { price: { $regex: req.params.key, $options: "i" } },
              { supplier: { $regex: req.params.key, $options: "i" } },
              // Add more fields as needed
            ],
          }
        : {};

      const count = await Products.countDocuments({ ...keyword });
      const result = await Products.find({ ...keyword });
      if (count > 0) {
        res.status(200).json({
          message: "Search result successfully fetched",
          totalProducts: count,
          products: result,
        });
      } else {
        res.status(400).json({
          message: "Not product found for this search",
        });
      }
      console.log("RESULTS", result);
    } catch (err) {
      res.status(500).json({ message: "Failed to get the product" });
    }
  },
};

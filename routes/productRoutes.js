const express = require("express");
const productController = require("../controllers/productControllers");

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProduct);
router.get("/search/:key", productController.serachProducts);
router.post("/", productController.createProduct);

module.exports = router;

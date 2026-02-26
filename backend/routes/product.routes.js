const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const { productController } = require("../controllers");
const { product } = require("../validators");

router.get("/", auth([]), productController.getProducts);
router.get("/categories", auth([]), productController.getProductCategories);
router.get("/:id", auth([]), productController.getProductById);

router.post(
  "/",
  auth(["vendor"]),
  validate(product.addProductSchema),
  productController.addProduct,
);

router.put(
  "/:id",
  auth(["vendor"]),
  validate(product.updateProductSchema),
  productController.updateProduct,
);

router.delete("/:id", auth(["vendor"]), productController.deleteProduct);

module.exports = router;

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const { productController } = require("../controllers");
const { product } = require("../validators");

router.get("/", auth([]), productController.getProducts);

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

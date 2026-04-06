const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { promotionController } = require("../controllers");
const { promotion } = require("../validators");

router.get("/active", auth(["buyer", "vendor"]), promotionController.listActiveDeals);
router.post(
  "/validate",
  auth(["buyer"]),
  validate(promotion.validatePromotionForCartSchema),
  promotionController.validatePromotionForCart,
);

router.get("/mine", auth(["vendor"]), promotionController.listVendorPromotions);
router.post(
  "/",
  auth(["vendor"]),
  validate(promotion.createPromotionSchema),
  promotionController.createPromotion,
);
router.put(
  "/:id",
  auth(["vendor"]),
  validate(promotion.updatePromotionSchema),
  promotionController.updatePromotion,
);
router.patch("/:id/toggle", auth(["vendor"]), promotionController.togglePromotion);
router.delete("/:id", auth(["vendor"]), promotionController.deletePromotion);

module.exports = router;

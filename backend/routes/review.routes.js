const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { reviewController } = require("../controllers");
const { review } = require("../validators");

router.get("/product/:productId", auth([]), reviewController.getProductReviews);
router.post(
  "/product/:productId",
  auth(["buyer"]),
  validate(review.upsertBuyerReviewSchema),
  reviewController.upsertBuyerReview,
);
router.patch(
  "/:reviewId/vendor-response",
  auth(["vendor"]),
  validate(review.vendorRespondSchema),
  reviewController.respondToReview,
);

module.exports = router;

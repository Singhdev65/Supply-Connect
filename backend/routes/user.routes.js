const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { userController } = require("../controllers");
const { user } = require("../validators");

router.get("/me", auth(), userController.getMyProfile);
router.put("/me", auth(), validate(user.updateProfileSchema), userController.updateMyProfile);
router.post(
  "/me/addresses",
  auth(),
  validate(user.createAddressSchema),
  userController.addAddress,
);
router.put(
  "/me/addresses/:addressId",
  auth(),
  validate(user.updateAddressSchema),
  userController.updateAddress,
);
router.delete("/me/addresses/:addressId", auth(), userController.deleteAddress);
router.patch("/me/addresses/:addressId/default", auth(), userController.setDefaultAddress);
router.get("/me/wishlist", auth(["buyer"]), userController.getWishlist);
router.post("/me/wishlist/:productId", auth(["buyer"]), userController.addToWishlist);
router.delete("/me/wishlist/:productId", auth(["buyer"]), userController.removeFromWishlist);
router.get("/me/recently-viewed", auth(["buyer"]), userController.getRecentlyViewed);
router.post("/me/recently-viewed/:productId", auth(["buyer"]), userController.markRecentlyViewed);
router.get("/me/seller-profile", auth(["vendor"]), userController.getSellerProfile);
router.put(
  "/me/seller-profile",
  auth(["vendor"]),
  validate(user.updateSellerProfileSchema),
  userController.updateSellerProfile,
);

module.exports = router;

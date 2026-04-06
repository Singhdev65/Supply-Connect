const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { returnController } = require("../controllers");
const { returns } = require("../validators");

router.post(
  "/",
  auth(["buyer"]),
  validate(returns.createReturnRequestSchema),
  returnController.createReturnRequest,
);
router.get("/mine", auth(["buyer"]), returnController.getBuyerReturnRequests);
router.get("/vendor", auth(["vendor"]), returnController.getVendorReturnRequests);
router.patch(
  "/:id/status",
  auth(["vendor"]),
  validate(returns.updateReturnStatusSchema),
  returnController.updateVendorReturnStatus,
);

module.exports = router;

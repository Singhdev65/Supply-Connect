const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { financeController } = require("../controllers");
const { finance } = require("../validators");

router.get("/summary", auth(["vendor"]), financeController.getFinanceSummary);
router.get("/transactions", auth(["vendor"]), financeController.getTransactions);
router.get("/payouts", auth(["vendor"]), financeController.getPayouts);
router.post(
  "/payouts/request",
  auth(["vendor"]),
  validate(finance.requestPayoutSchema),
  financeController.requestPayout,
);
router.get("/tax-report", auth(["vendor"]), financeController.getTaxReport);

module.exports = router;

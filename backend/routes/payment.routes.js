const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const { paymentController } = require("../controllers");

router.post("/create", auth(["buyer"]), paymentController.createPayment);
router.post("/cod", auth(["buyer"]), paymentController.confirmCOD);

router.post("/", auth(["buyer"]), paymentController.createPayment);

router.post("/verify", auth(["buyer"]), paymentController.verifyPayment);

module.exports = router;

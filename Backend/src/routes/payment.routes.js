const router = require("express").Router();
const {
  createPayment,
  verifyPayment
} = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware.authuserMiddleware, createPayment);
router.post("/verify", authMiddleware.authuserMiddleware, verifyPayment);

module.exports = router;
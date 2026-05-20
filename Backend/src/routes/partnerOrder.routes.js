const router = require("express").Router();
const controller = require("../controllers/partnerOrder.controller");
const auth = require("../middleware/auth.middleware");

// food partner orders
router.get(
  "/",
  auth.authFoodPartnerMiddleware,
  controller.getPartnerOrders
);

router.put(
  "/:id",
  auth.authFoodPartnerMiddleware,
  controller.updateOrderStatus
);

module.exports = router;
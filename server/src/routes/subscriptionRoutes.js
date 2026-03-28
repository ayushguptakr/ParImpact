const express = require("express");
const {
  getMySubscription,
  upsertSubscription,
  cancelMySubscription,
} = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");
const {
  attachSubscriptionState,
  requireActiveSubscription,
} = require("../middleware/subscriptionMiddleware");

const router = express.Router();

router.get("/me", protect, getMySubscription);
router.post("/me", protect, upsertSubscription);
router.patch("/me/cancel", protect, cancelMySubscription);

// Example protected feature endpoint demonstrating subscription gating behavior.
router.get(
  "/feature-access",
  protect,
  attachSubscriptionState,
  requireActiveSubscription,
  (req, res) => {
    return res.status(200).json({
      message: "Feature access granted",
      subscriptionStatus: req.subscriptionAccess,
    });
  }
);

module.exports = router;

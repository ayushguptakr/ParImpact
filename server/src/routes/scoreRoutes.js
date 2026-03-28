const express = require("express");
const { addScore, getMyScores } = require("../controllers/scoreController");
const { protect } = require("../middleware/authMiddleware");
const {
  attachSubscriptionState,
  requireActiveSubscription,
} = require("../middleware/subscriptionMiddleware");

const router = express.Router();

router.get("/me", protect, attachSubscriptionState, requireActiveSubscription, getMyScores);
router.post("/me", protect, attachSubscriptionState, requireActiveSubscription, addScore);

module.exports = router;

const express = require("express");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const {
  listUsers,
  updateUser,
  listSubscriptions,
  updateSubscription,
  listWinnerClaims,
  verifyWinner,
  markWinnerPaid,
  listCharitiesAdmin,
} = require("../controllers/adminController");
const { validateObjectId } = require("../middleware/validateObjectId");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/users", listUsers);
router.patch("/users/:id", validateObjectId("id"), updateUser);
router.get("/subscriptions", listSubscriptions);
router.patch("/subscriptions/:id", validateObjectId("id"), updateSubscription);
router.get("/charities", listCharitiesAdmin);

router.get("/draws/winner-claims", listWinnerClaims);
router.patch(
  "/draws/:drawId/winners/:winnerId/verify",
  validateObjectId("drawId"),
  validateObjectId("winnerId"),
  verifyWinner
);
router.patch(
  "/draws/:drawId/winners/:winnerId/pay",
  validateObjectId("drawId"),
  validateObjectId("winnerId"),
  markWinnerPaid
);

module.exports = router;

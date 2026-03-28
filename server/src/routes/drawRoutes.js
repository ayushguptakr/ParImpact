const express = require("express");
const {
  simulateMonthlyDraw,
  publishMonthlyDraw,
  getLatestDraw,
  getMyWinnerClaims,
  uploadWinnerProof,
} = require("../controllers/drawController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { uploadProofImage } = require("../middleware/uploadMiddleware");
const { validateObjectId } = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/latest", protect, getLatestDraw);
router.get("/my-claims", protect, getMyWinnerClaims);
router.post(
  "/:drawId/winners/:winnerId/proof",
  protect,
  validateObjectId("drawId"),
  validateObjectId("winnerId"),
  uploadProofImage.single("proofImage"),
  uploadWinnerProof
);
router.post("/simulate", protect, requireAdmin, simulateMonthlyDraw);
router.post("/publish", protect, requireAdmin, publishMonthlyDraw);

module.exports = router;

const express = require("express");
const {
  getCharities,
  createCharity,
  updateCharity,
  deleteCharity,
} = require("../controllers/charityController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/", getCharities);
router.post("/", protect, requireAdmin, createCharity);
router.patch("/:id", protect, requireAdmin, validateObjectId("id"), updateCharity);
router.delete("/:id", protect, requireAdmin, validateObjectId("id"), deleteCharity);

module.exports = router;

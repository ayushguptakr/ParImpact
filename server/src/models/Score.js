const mongoose = require("mongoose");
const MAX_SCORES = 5;

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    scores: [
      {
        value: {
          type: Number,
          required: true,
          min: 1,
          max: 45,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

scoreSchema.path("scores").validate(function validateScoreWindow(scores) {
  return Array.isArray(scores) && scores.length <= MAX_SCORES;
}, "Only the latest 5 scores can be stored");

module.exports = mongoose.model("Score", scoreSchema);

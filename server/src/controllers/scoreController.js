const Score = require("../models/Score");

const MAX_SCORES = 5;

const sortScoresDesc = (scores) => {
  return [...scores].sort((a, b) => new Date(b.date) - new Date(a.date));
};

const sortScoresAsc = (scores) => {
  return [...scores].sort((a, b) => new Date(a.date) - new Date(b.date));
};

const addScore = async (req, res) => {
  try {
    const { value, date } = req.body;

    if (typeof value !== "number" || value < 1 || value > 45) {
      return res
        .status(400)
        .json({ message: "Score value must be a number between 1 and 45" });
    }

    const scoreDate = date ? new Date(date) : new Date();
    if (Number.isNaN(scoreDate.getTime())) {
      return res.status(400).json({ message: "Invalid score date" });
    }

    const scoreDoc = await Score.findOneAndUpdate(
      { user: req.user._id },
      {
        $push: {
          scores: {
            $each: [{ value, date: scoreDate }],
            $sort: { date: 1 },
            $slice: -MAX_SCORES,
          },
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    return res.status(201).json({
      message: "Score added successfully",
      scores: sortScoresDesc(scoreDoc.scores),
      totalStored: scoreDoc.scores.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyScores = async (req, res) => {
  try {
    const scoreDoc = await Score.findOne({ user: req.user._id });
    if (!scoreDoc) {
      return res.status(200).json({ scores: [], totalStored: 0 });
    }

    if (scoreDoc.scores.length > MAX_SCORES) {
      // Self-heal legacy data to keep score storage strictly capped at 5.
      scoreDoc.scores = sortScoresAsc(scoreDoc.scores).slice(-MAX_SCORES);
      await scoreDoc.save();
    }

    return res.status(200).json({
      scores: sortScoresDesc(scoreDoc.scores),
      totalStored: scoreDoc.scores.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addScore,
  getMyScores,
};

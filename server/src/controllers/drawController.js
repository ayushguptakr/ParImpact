const Draw = require("../models/Draw");
const Score = require("../models/Score");
const Subscription = require("../models/Subscription");
const crypto = require("crypto");

const MATCH_SPLITS = {
  5: 0.4,
  4: 0.35,
  3: 0.25,
};
const MONTH_KEY_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const generateRandomDrawNumbers = () => {
  const unique = new Set();
  while (unique.size < 5) {
    const num = crypto.randomInt(1, 46);
    unique.add(num);
  }
  return [...unique].sort((a, b) => a - b);
};

const normalizeAndValidateDrawNumbers = (numbers) => {
  if (!Array.isArray(numbers) || numbers.length !== 5) {
    return null;
  }

  const cleanNumbers = numbers.map((n) => Number(n));
  const inRange = cleanNumbers.every(
    (n) => Number.isInteger(n) && n >= 1 && n <= 45
  );
  const isUnique = new Set(cleanNumbers).size === 5;

  if (!inRange || !isUnique) {
    return null;
  }

  return cleanNumbers.sort((a, b) => a - b);
};

const getMonthKey = (date = new Date()) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const normalizeMonthKey = (rawMonthKey) => {
  if (!rawMonthKey) {
    return getMonthKey();
  }

  const monthKey = String(rawMonthKey).trim();
  if (!MONTH_KEY_REGEX.test(monthKey)) {
    return null;
  }

  return monthKey;
};

const getCurrentCarryIn = async () => {
  const latestDraw = await Draw.findOne({}).sort({ publishedAt: -1 });
  return latestDraw ? latestDraw.rolloverToNext || 0 : 0;
};

const getEligibleUserEntries = async () => {
  const activeSubs = await Subscription.find({
    status: "active",
    expiryDate: { $gte: new Date() },
  }).select("user");

  const userIds = activeSubs.map((sub) => sub.user);
  if (!userIds.length) {
    return [];
  }

  const scoreDocs = await Score.find({ user: { $in: userIds } });
  const scoreDocByUserId = new Map(scoreDocs.map((doc) => [String(doc.user), doc]));

  return userIds
    .map((userId) => {
      const scoreDoc = scoreDocByUserId.get(String(userId));
      if (!scoreDoc || scoreDoc.scores.length < 5) {
        return null;
      }

      const latestFive = [...scoreDoc.scores]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map((entry) => entry.value);

      return {
        userId,
        numbers: latestFive,
      };
    })
    .filter(Boolean);
};

const evaluateDraw = ({ drawNumbers, poolAmount, carryIn, entries }) => {
  const drawSet = new Set(drawNumbers);
  const tierGroups = {
    5: [],
    4: [],
    3: [],
  };

  entries.forEach((entry) => {
    const matchedNumbers = [...new Set(entry.numbers)].filter((n) => drawSet.has(n));
    const matchCount = matchedNumbers.length;
    if (matchCount >= 3 && matchCount <= 5) {
      tierGroups[matchCount].push({
        user: entry.userId,
        matchedNumbers: matchedNumbers.sort((a, b) => a - b),
      });
    }
  });

  const effectivePool = poolAmount + carryIn;
  const tierPool = {
    5: Number((effectivePool * MATCH_SPLITS[5]).toFixed(2)),
    4: Number((effectivePool * MATCH_SPLITS[4]).toFixed(2)),
    3: Number((effectivePool * MATCH_SPLITS[3]).toFixed(2)),
  };

  const winnerGroups = [5, 4, 3].map((tier) => {
    const winners = tierGroups[tier];
    const winnerCount = winners.length;
    const payoutPerWinner =
      winnerCount > 0 ? Number((tierPool[tier] / winnerCount).toFixed(2)) : 0;

    return {
      matchCount: tier,
      splitPercentage: MATCH_SPLITS[tier],
      winnerCount,
      poolAmount: tierPool[tier],
      winners: winners.map((winner) => ({
        user: winner.user,
        matchedNumbers: winner.matchedNumbers,
        payoutAmount: payoutPerWinner,
      })),
    };
  });

  const jackpotRollover = tierGroups[5].length === 0 ? tierPool[5] : 0;

  return {
    drawNumbers,
    totalPool: Number(poolAmount.toFixed(2)),
    carryIn: Number(carryIn.toFixed(2)),
    effectivePool: Number(effectivePool.toFixed(2)),
    rolloverToNext: Number(jackpotRollover.toFixed(2)),
    winnerGroups,
    eligibleParticipants: entries.length,
  };
};

const simulateMonthlyDraw = async (req, res) => {
  try {
    const { totalPool, drawNumbers } = req.body;
    if (typeof totalPool !== "number" || totalPool <= 0) {
      return res.status(400).json({ message: "totalPool must be a positive number" });
    }

    const normalizedDrawNumbers = drawNumbers
      ? normalizeAndValidateDrawNumbers(drawNumbers)
      : generateRandomDrawNumbers();
    if (!normalizedDrawNumbers) {
      return res.status(400).json({
        message:
          "drawNumbers must contain 5 unique integers between 1 and 45",
      });
    }

    const carryIn = await getCurrentCarryIn();
    const entries = await getEligibleUserEntries();
    const result = evaluateDraw({
      drawNumbers: normalizedDrawNumbers,
      poolAmount: totalPool,
      carryIn,
      entries,
    });

    return res.status(200).json({
      mode: "simulation",
      monthKey: getMonthKey(),
      ...result,
      simulatedAt: new Date(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const publishMonthlyDraw = async (req, res) => {
  try {
    const { totalPool, drawNumbers, monthKey } = req.body;
    if (typeof totalPool !== "number" || totalPool <= 0) {
      return res.status(400).json({ message: "totalPool must be a positive number" });
    }

    const drawMonthKey = normalizeMonthKey(monthKey);
    if (!drawMonthKey) {
      return res.status(400).json({ message: "monthKey must follow YYYY-MM format" });
    }
    const existingDraw = await Draw.findOne({ monthKey: drawMonthKey });
    if (existingDraw) {
      return res
        .status(409)
        .json({ message: "Draw already published for this month" });
    }

    const normalizedDrawNumbers = drawNumbers
      ? normalizeAndValidateDrawNumbers(drawNumbers)
      : generateRandomDrawNumbers();
    if (!normalizedDrawNumbers) {
      return res.status(400).json({
        message:
          "drawNumbers must contain 5 unique integers between 1 and 45",
      });
    }

    const carryIn = await getCurrentCarryIn();
    const entries = await getEligibleUserEntries();
    const result = evaluateDraw({
      drawNumbers: normalizedDrawNumbers,
      poolAmount: totalPool,
      carryIn,
      entries,
    });

    const publishedDraw = await Draw.create({
      monthKey: drawMonthKey,
      drawNumbers: result.drawNumbers,
      totalPool: result.totalPool,
      carryIn: result.carryIn,
      rolloverToNext: result.rolloverToNext,
      winnerGroups: result.winnerGroups,
      publishedAt: new Date(),
      simulatedAt: null,
    });

    return res.status(201).json({
      mode: "published",
      monthKey: drawMonthKey,
      draw: publishedDraw,
      eligibleParticipants: result.eligibleParticipants,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne({}).sort({ publishedAt: -1 });
    if (!draw) {
      return res.status(404).json({ message: "No draw has been published yet" });
    }

    return res.status(200).json({ draw });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyWinnerClaims = async (req, res) => {
  try {
    const draws = await Draw.find({ "winnerGroups.winners.user": req.user._id }).sort({
      publishedAt: -1,
    });

    const claims = [];
    draws.forEach((draw) => {
      draw.winnerGroups.forEach((group) => {
        group.winners.forEach((winner) => {
          if (String(winner.user) === String(req.user._id)) {
            claims.push({
              drawId: draw._id,
              monthKey: draw.monthKey,
              winnerId: winner._id,
              matchCount: group.matchCount,
              matchedNumbers: winner.matchedNumbers,
              payoutAmount: winner.payoutAmount,
              verificationStatus: winner.verificationStatus,
              paymentStatus: winner.paymentStatus,
              proofImageUrl: winner.proofImageUrl,
              proofSubmittedAt: winner.proofSubmittedAt,
            });
          }
        });
      });
    });

    return res.status(200).json({ claims });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadWinnerProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Proof image file is required" });
    }

    const draw = await Draw.findById(req.params.drawId);
    if (!draw) {
      return res.status(404).json({ message: "Draw not found" });
    }

    let winnerFound = null;
    draw.winnerGroups.forEach((group) => {
      group.winners.forEach((winner) => {
        if (String(winner._id) === req.params.winnerId) {
          if (String(winner.user) !== String(req.user._id)) {
            winnerFound = "not-owner";
            return;
          }
          if (winner.paymentStatus === "paid") {
            winnerFound = "already-paid";
            return;
          }
          winner.proofImageUrl = `/uploads/proofs/${req.file.filename}`;
          winner.proofSubmittedAt = new Date();
          winner.verificationStatus = "pending";
          winner.paymentStatus = "pending";
          winnerFound = winner;
        }
      });
    });

    if (winnerFound === "not-owner") {
      return res.status(403).json({ message: "Not allowed to upload proof for this claim" });
    }
    if (winnerFound === "already-paid") {
      return res.status(400).json({ message: "Proof cannot be updated after payout is completed" });
    }
    if (!winnerFound) {
      return res.status(404).json({ message: "Winner entry not found" });
    }

    await draw.save();
    return res.status(200).json({
      message: "Proof uploaded successfully",
      claim: {
        drawId: draw._id,
        winnerId: winnerFound._id,
        proofImageUrl: winnerFound.proofImageUrl,
        proofSubmittedAt: winnerFound.proofSubmittedAt,
        verificationStatus: winnerFound.verificationStatus,
        paymentStatus: winnerFound.paymentStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  simulateMonthlyDraw,
  publishMonthlyDraw,
  getLatestDraw,
  getMyWinnerClaims,
  uploadWinnerProof,
};

const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Charity = require("../models/Charity");
const Draw = require("../models/Draw");

const listUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .populate("charity", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const allowed = ["role", "subscriptionStatus", "contributionPercentage"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    });

    if (
      updates.contributionPercentage !== undefined &&
      (updates.contributionPercentage < 10 || updates.contributionPercentage > 100)
    ) {
      return res.status(400).json({
        message: "contributionPercentage must be between 10 and 100",
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .select("-password")
      .populate("charity", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate("user", "name email role subscriptionStatus")
      .sort({ createdAt: -1 });
    return res.status(200).json({ subscriptions });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate(
      "user",
      "name email role subscriptionStatus"
    );
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const { plan, status, expiryDate } = req.body;
    if (plan !== undefined) {
      if (!["monthly", "yearly"].includes(plan)) {
        return res.status(400).json({ message: "plan must be monthly or yearly" });
      }
      subscription.plan = plan;
    }

    if (status !== undefined) {
      if (!["active", "inactive", "cancelled", "expired"].includes(status)) {
        return res.status(400).json({
          message: "status must be active, inactive, cancelled, or expired",
        });
      }
      subscription.status = status;
    }

    if (expiryDate !== undefined) {
      const parsedDate = new Date(expiryDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "expiryDate must be a valid date" });
      }
      subscription.expiryDate = parsedDate;
    }

    await subscription.save();

    if (subscription.user?._id) {
      const mappedStatus = subscription.status === "active" ? "active" : "inactive";
      await User.findByIdAndUpdate(subscription.user._id, { subscriptionStatus: mappedStatus });
    }

    return res.status(200).json({ message: "Subscription updated", subscription });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listWinnerClaims = async (req, res) => {
  try {
    const draws = await Draw.find({})
      .populate("winnerGroups.winners.user", "name email")
      .sort({ publishedAt: -1 });

    const claims = [];
    draws.forEach((draw) => {
      draw.winnerGroups.forEach((group) => {
        group.winners.forEach((winner) => {
          claims.push({
            drawId: draw._id,
            monthKey: draw.monthKey,
            winnerId: winner._id,
            user: winner.user,
            matchCount: group.matchCount,
            matchedNumbers: winner.matchedNumbers,
            payoutAmount: winner.payoutAmount,
            verificationStatus: winner.verificationStatus,
            paymentStatus: winner.paymentStatus,
            proofImageUrl: winner.proofImageUrl,
            proofSubmittedAt: winner.proofSubmittedAt,
          });
        });
      });
    });

    return res.status(200).json({ claims });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyWinner = async (req, res) => {
  try {
    const { verificationStatus } = req.body;
    if (!["approved", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({ message: "verificationStatus must be approved or rejected" });
    }

    const draw = await Draw.findById(req.params.drawId);
    if (!draw) {
      return res.status(404).json({ message: "Draw not found" });
    }

    let winnerFound = null;
    draw.winnerGroups.forEach((group) => {
      group.winners.forEach((winner) => {
        if (String(winner._id) === req.params.winnerId) {
          if (!winner.proofImageUrl) {
            winnerFound = "no-proof";
            return;
          }
          if (winner.paymentStatus === "paid") {
            winnerFound = "already-paid";
            return;
          }
          winner.verificationStatus = verificationStatus;
          winner.reviewedAt = new Date();
          winner.paymentStatus = "pending";
          winnerFound = winner;
        }
      });
    });

    if (winnerFound === "no-proof") {
      return res.status(400).json({ message: "Proof image required before verification" });
    }
    if (winnerFound === "already-paid") {
      return res.status(400).json({ message: "Paid winners cannot be re-verified" });
    }
    if (!winnerFound) {
      return res.status(404).json({ message: "Winner entry not found" });
    }

    await draw.save();
    return res.status(200).json({ message: "Winner verification updated", winner: winnerFound });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const markWinnerPaid = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.drawId);
    if (!draw) {
      return res.status(404).json({ message: "Draw not found" });
    }

    let winnerFound = null;
    draw.winnerGroups.forEach((group) => {
      group.winners.forEach((winner) => {
        if (String(winner._id) === req.params.winnerId) {
          if (winner.verificationStatus !== "approved") {
            winnerFound = "not-approved";
            return;
          }
          if (winner.paymentStatus === "paid") {
            winnerFound = "already-paid";
            return;
          }
          winner.paymentStatus = "paid";
          winner.reviewedAt = new Date();
          winnerFound = winner;
        }
      });
    });

    if (winnerFound === "not-approved") {
      return res.status(400).json({ message: "Winner must be approved before payout" });
    }
    if (winnerFound === "already-paid") {
      return res.status(400).json({ message: "Winner is already marked as paid" });
    }
    if (!winnerFound) {
      return res.status(404).json({ message: "Winner entry not found" });
    }

    await draw.save();
    return res.status(200).json({ message: "Winner marked as paid", winner: winnerFound });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listCharitiesAdmin = async (req, res) => {
  try {
    const charities = await Charity.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ charities });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  listUsers,
  updateUser,
  listSubscriptions,
  updateSubscription,
  listWinnerClaims,
  verifyWinner,
  markWinnerPaid,
  listCharitiesAdmin,
};

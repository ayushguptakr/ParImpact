const Subscription = require("../models/Subscription");
const User = require("../models/User");
const {
  calculateExpiryDate,
  getEffectiveStatus,
  normalizeSubscriptionResponse,
} = require("../services/subscriptionService");

const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      return res.status(200).json({
        subscription: null,
        access: "inactive",
      });
    }

    const effectiveStatus = getEffectiveStatus(subscription);
    if (effectiveStatus === "expired" && subscription.status !== "expired") {
      subscription.status = "expired";
      await subscription.save();
      await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "inactive" });
    }

    return res.status(200).json({
      subscription: normalizeSubscriptionResponse(subscription),
      access: effectiveStatus === "active" ? "active" : "inactive",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const upsertSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return res
        .status(400)
        .json({ message: "Valid subscription plan is required" });
    }

    const now = new Date();
    const nextExpiry = calculateExpiryDate(plan, now);

    let subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      subscription = await Subscription.create({
        user: req.user._id,
        plan,
        status: "active",
        expiryDate: nextExpiry,
      });
    } else {
      subscription.plan = plan;
      subscription.status = "active";
      subscription.expiryDate = nextExpiry;
      await subscription.save();
    }

    await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "active" });

    return res.status(200).json({
      message: "Subscription activated",
      subscription: normalizeSubscriptionResponse(subscription),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const cancelMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = "cancelled";
    await subscription.save();
    await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "cancelled" });

    return res.status(200).json({
      message: "Subscription cancelled",
      subscription: normalizeSubscriptionResponse(subscription),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMySubscription,
  upsertSubscription,
  cancelMySubscription,
};

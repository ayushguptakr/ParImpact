const Subscription = require("../models/Subscription");
const User = require("../models/User");
const { getEffectiveStatus } = require("../services/subscriptionService");

const attachSubscriptionState = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    const effectiveStatus = getEffectiveStatus(subscription);

    if (subscription && effectiveStatus === "expired" && subscription.status !== "expired") {
      subscription.status = "expired";
      await subscription.save();
      await User.findByIdAndUpdate(req.user._id, { subscriptionStatus: "inactive" });
    }

    req.subscription = subscription;
    req.subscriptionAccess = effectiveStatus;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to evaluate subscription status" });
  }
};

const requireActiveSubscription = (req, res, next) => {
  if (req.subscriptionAccess !== "active") {
    return res.status(403).json({
      message: "Active subscription required",
      subscriptionStatus: req.subscriptionAccess,
    });
  }
  return next();
};

module.exports = {
  attachSubscriptionState,
  requireActiveSubscription,
};

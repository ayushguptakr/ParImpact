const calculateExpiryDate = (plan, fromDate = new Date()) => {
  const expiry = new Date(fromDate);
  if (plan === "monthly") {
    expiry.setMonth(expiry.getMonth() + 1);
    return expiry;
  }

  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry;
};

const getEffectiveStatus = (subscription) => {
  if (!subscription) {
    return "inactive";
  }

  if (subscription.status !== "active") {
    return subscription.status;
  }

  if (subscription.expiryDate < new Date()) {
    return "expired";
  }

  return "active";
};

const normalizeSubscriptionResponse = (subscription) => {
  return {
    id: subscription._id,
    plan: subscription.plan,
    status: getEffectiveStatus(subscription),
    expiryDate: subscription.expiryDate,
  };
};

module.exports = {
  calculateExpiryDate,
  getEffectiveStatus,
  normalizeSubscriptionResponse,
};

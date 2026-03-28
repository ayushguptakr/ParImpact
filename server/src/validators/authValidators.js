const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const validateRegisterInput = (payload = {}) => {
  const name = String(payload.name || "").trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const charityId = String(payload.charityId || "").trim();
  const rawContributionPercentage = payload.contributionPercentage;
  const contributionPercentage =
    rawContributionPercentage === undefined ? 10 : Number(rawContributionPercentage);
  const role = payload.role;

  if (!name || !email || !password || !charityId) {
    return { ok: false, message: "name, email, password, and charityId are required" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Invalid email format" };
  }

  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters" };
  }

  if (!Number.isFinite(contributionPercentage) || contributionPercentage < 10 || contributionPercentage > 100) {
    return { ok: false, message: "contributionPercentage must be between 10 and 100" };
  }

  if (role && role !== "user") {
    return { ok: false, message: "Role cannot be set during registration" };
  }

  return {
    ok: true,
    value: { name, email, password, charityId, contributionPercentage },
  };
};

const validateLoginInput = (payload = {}) => {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");

  if (!email || !password) {
    return { ok: false, message: "email and password are required" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Invalid email format" };
  }

  return { ok: true, value: { email, password } };
};

module.exports = {
  normalizeEmail,
  validateRegisterInput,
  validateLoginInput,
};

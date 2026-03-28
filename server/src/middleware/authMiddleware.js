const jwt = require("jsonwebtoken");
const User = require("../models/User");

const extractBearerToken = (authHeader = "") => {
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};

const protect = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization || "");

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = {
  protect,
  extractBearerToken,
  requireAdmin: (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    return next();
  },
};

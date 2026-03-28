const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many auth attempts, please try again later." },
});

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value).reduce((acc, key) => {
      if (key.startsWith("$") || key.includes(".")) {
        return acc;
      }
      acc[key] = sanitizeValue(value[key]);
      return acc;
    }, {});
  }

  return value;
};

const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
};

module.exports = {
  helmet,
  apiLimiter,
  authLimiter,
  sanitizeBody,
};

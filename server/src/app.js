const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const drawRoutes = require("./routes/drawRoutes");
const charityRoutes = require("./routes/charityRoutes");
const adminRoutes = require("./routes/adminRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const {
  helmet,
  apiLimiter,
  authLimiter,
  sanitizeBody,
} = require("./middleware/securityMiddleware");

const app = express();

const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://par-impact.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(sanitizeBody);
app.use("/api", apiLimiter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/draws", drawRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

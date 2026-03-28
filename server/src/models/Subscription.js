const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled", "expired"],
      default: "inactive",
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);

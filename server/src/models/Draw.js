const mongoose = require("mongoose");

const winnerGroupSchema = new mongoose.Schema(
  {
    matchCount: {
      type: Number,
      enum: [3, 4, 5],
      required: true,
    },
    winnerCount: {
      type: Number,
      default: 0,
    },
    winners: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        matchedNumbers: {
          type: [Number],
          default: [],
        },
        payoutAmount: {
          type: Number,
          default: 0,
        },
        verificationStatus: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        paymentStatus: {
          type: String,
          enum: ["pending", "paid"],
          default: "pending",
        },
        reviewedAt: {
          type: Date,
          default: null,
        },
        proofImageUrl: {
          type: String,
          default: null,
        },
        proofSubmittedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    poolAmount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const drawSchema = new mongoose.Schema(
  {
    monthKey: {
      type: String,
      required: true,
      unique: true,
    },
    drawNumbers: {
      type: [Number],
      required: true,
      validate: {
        validator: (nums) => nums.length === 5,
        message: "Exactly 5 draw numbers are required",
      },
    },
    totalPool: {
      type: Number,
      required: true,
    },
    carryIn: {
      type: Number,
      default: 0,
    },
    rolloverToNext: {
      type: Number,
      default: 0,
    },
    winnerGroups: {
      type: [winnerGroupSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["published"],
      default: "published",
    },
    simulatedAt: {
      type: Date,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Draw", drawSchema);

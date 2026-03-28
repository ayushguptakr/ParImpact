const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Charity name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Charity description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Charity image is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Charity", charitySchema);

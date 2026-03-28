const User = require("../models/User");
const Charity = require("../models/Charity");
const mongoose = require("mongoose");
const { generateToken } = require("../utils/jwt");
const { validateRegisterInput, validateLoginInput } = require("../validators/authValidators");

const registerUser = async (req, res) => {
  try {
    const { ok, message, value } = validateRegisterInput(req.body);
    if (!ok) {
      return res.status(400).json({ message });
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (!mongoose.Types.ObjectId.isValid(value.charityId)) {
      return res.status(400).json({ message: "Selected charity is invalid" });
    }

    const charity = await Charity.findOne({ _id: value.charityId, isActive: true });
    if (!charity) {
      return res.status(400).json({ message: "Selected charity is invalid" });
    }

    const user = await User.create({
      name: value.name,
      email: value.email,
      password: value.password,
      charity: charity._id,
      contributionPercentage: value.contributionPercentage,
    });

    const userWithCharity = await User.findById(user._id)
      .select("-password")
      .populate("charity", "name description image");

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: userWithCharity._id,
        name: userWithCharity.name,
        email: userWithCharity.email,
        role: userWithCharity.role,
        subscriptionStatus: userWithCharity.subscriptionStatus,
        charity: userWithCharity.charity,
        contributionPercentage: userWithCharity.contributionPercentage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      ...(process.env.NODE_ENV === "production" ? {} : { stack: error.stack }),
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { ok, message, value } = validateLoginInput(req.body);
    if (!ok) {
      return res.status(400).json({ message });
    }

    const user = await User.findOne({ email: value.email }).populate(
      "charity",
      "name description image"
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await user.comparePassword(value.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        charity: user.charity,
        contributionPercentage: user.contributionPercentage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      ...(process.env.NODE_ENV === "production" ? {} : { stack: error.stack }),
    });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("charity", "name description image");
  return res.status(200).json({ user });
};

const updateMyCharitySelection = async (req, res) => {
  try {
    const { charityId, contributionPercentage } = req.body;

    if (!charityId) {
      return res.status(400).json({ message: "charityId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(charityId)) {
      return res.status(400).json({ message: "Selected charity is invalid" });
    }

    if (
      typeof contributionPercentage !== "number" ||
      contributionPercentage < 10 ||
      contributionPercentage > 100
    ) {
      return res.status(400).json({
        message: "contributionPercentage must be a number between 10 and 100",
      });
    }

    const charity = await Charity.findOne({ _id: charityId, isActive: true });
    if (!charity) {
      return res.status(400).json({ message: "Selected charity is invalid" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        charity: charity._id,
        contributionPercentage,
      },
      { new: true }
    )
      .select("-password")
      .populate("charity", "name description image");

    return res.status(200).json({
      message: "Charity selection updated",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      ...(process.env.NODE_ENV === "production" ? {} : { stack: error.stack }),
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateMyCharitySelection,
};

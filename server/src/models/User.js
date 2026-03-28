const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "cancelled"],
      default: "inactive",
    },
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: [true, "Charity selection is required"],
    },
    contributionPercentage: {
      type: Number,
      min: 10,
      max: 100,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function preSave() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return;
});

userSchema.methods.comparePassword = function comparePassword(plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

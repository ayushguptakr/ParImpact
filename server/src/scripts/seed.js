const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Charity = require("../models/Charity");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Score = require("../models/Score");

dotenv.config();

const charitySeeds = [
  {
    name: "Fairway Futures",
    description: "Supports youth golf development and education access.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
    isActive: true,
  },
  {
    name: "Greens for Good",
    description: "Funds community food and wellness initiatives.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
    isActive: true,
  },
  {
    name: "Hope on the Course",
    description: "Provides mental health support through sports programs.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846",
    isActive: true,
  },
];

const userSeeds = [
  {
    name: "Platform Admin",
    email: "admin@golfcharity.local",
    role: "admin",
    contributionPercentage: 15,
    subscriptionPlan: "yearly",
    scoreValues: [8, 14, 22, 30, 41],
  },
  {
    name: "Ava Thompson",
    email: "ava@golfcharity.local",
    role: "user",
    contributionPercentage: 12,
    subscriptionPlan: "monthly",
    scoreValues: [5, 9, 17, 26, 34],
  },
  {
    name: "Noah Brooks",
    email: "noah@golfcharity.local",
    role: "user",
    contributionPercentage: 10,
    subscriptionPlan: "monthly",
    scoreValues: [3, 11, 19, 27, 35],
  },
];

const createRecentScoreEntries = (values) => {
  const now = new Date();
  return values.map((value, index) => ({
    value,
    date: new Date(now.getTime() - (values.length - index) * 86400000),
  }));
};

const upsertCharities = async () => {
  const charities = [];
  for (const charityData of charitySeeds) {
    const charity = await Charity.findOneAndUpdate(
      { name: charityData.name },
      charityData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    charities.push(charity);
  }
  return charities;
};

const upsertUsers = async (charities) => {
  const defaultPasswordHash = await bcrypt.hash("Pass@123", 10);
  const users = [];

  for (let i = 0; i < userSeeds.length; i += 1) {
    const seed = userSeeds[i];
    const selectedCharity = charities[i % charities.length];

    const user = await User.findOneAndUpdate(
      { email: seed.email.toLowerCase() },
      {
        name: seed.name,
        email: seed.email.toLowerCase(),
        password: defaultPasswordHash,
        role: seed.role,
        subscriptionStatus: "active",
        charity: selectedCharity._id,
        contributionPercentage: seed.contributionPercentage,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    users.push({ ...seed, user });
  }

  return users;
};

const upsertSubscriptions = async (seededUsers) => {
  const now = new Date();
  for (const entry of seededUsers) {
    const expiryDate = new Date(now);
    if (entry.subscriptionPlan === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    await Subscription.findOneAndUpdate(
      { user: entry.user._id },
      {
        user: entry.user._id,
        plan: entry.subscriptionPlan,
        status: "active",
        expiryDate,
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
};

const upsertScores = async (seededUsers) => {
  for (const entry of seededUsers) {
    await Score.findOneAndUpdate(
      { user: entry.user._id },
      {
        user: entry.user._id,
        scores: createRecentScoreEntries(entry.scoreValues),
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
};

const runSeed = async () => {
  try {
    await connectDB();

    const charities = await upsertCharities();
    const seededUsers = await upsertUsers(charities);
    await upsertSubscriptions(seededUsers);
    await upsertScores(seededUsers);

    console.log("Seed complete.");
    console.log("Admin login:");
    console.log("  email: admin@golfcharity.local");
    console.log("  password: Pass@123");
    console.log("Sample user password for all seeded users: Pass@123");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

runSeed();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

module.exports = {
  validateEnv,
};

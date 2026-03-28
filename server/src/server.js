const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");

dotenv.config();
validateEnv();

const PORT = process.env.PORT || 5000;
let httpServer = null;

const startServer = async () => {
  await connectDB();

  httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

process.on("SIGTERM", () => {
  if (!httpServer) {
    process.exit(0);
    return;
  }

  httpServer.close(() => {
    process.exit(0);
  });
});

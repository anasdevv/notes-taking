const pino = require("pino");
const fs = require("fs");
const path = require("path");

// Create a logs directory if it doesn't exist
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Generate a unique log file name with timestamp
// unique log file based on date
const timestamp = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
const logFilePath = path.join(logsDir, `${timestamp}.log`);

const logLevel = process.env.NODE_ENV === "test" ? "silent" : "info";

// Create the logger with multiple transports
const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
        level: logLevel, // Adjust the log level as needed
      },
      {
        target: "pino/file",
        options: { destination: logFilePath },
        level: logLevel, // Adjust the log level as needed
      },
    ],
  },
});

module.exports = logger;

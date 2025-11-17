// ============================================================
// 🧩 LoggerLib — Logging library
// ============================================================

import winston from "winston";
import chalk from "chalk";
import path from "node:path";
import config from "@/config/env.config.js";

// ------------------------------------------------------
// 1️⃣ Logger Interface
// ------------------------------------------------------
interface LogInfo extends winston.Logform.TransformableInfo {
  message: string;
  label?: string;
}

// Logger format components
const { combine, timestamp, printf } = winston.format;

//  Logger transports array
const transports: winston.transport[] = [];

// Log directory path
const logDir = path.join(process.cwd(), "logs");

// ------------------------------------------------------
// 2️⃣ Loggger custom format
// ------------------------------------------------------
const customFormat = combine(
  // Add timestamp to log entries
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

  // Custom log message format
  printf((info) => {
    // Destructure log info
    const { timestamp, level, message, label, ...meta } = info as LogInfo;

    // Format label and metadata
    const labelStr = label ? `[${label}] ` : "";

    // Clean metadata: only include string keys
    const cleanMeta = Object.fromEntries(
      Object.entries(meta).filter(([key]) => typeof key === "string")
    );

    // Stringify metadata if present
    const metaStr = Object.keys(cleanMeta).length
      ? `\n${JSON.stringify(cleanMeta, null, 2)}`
      : "";

    // Color-coded log output
    switch (level) {
      // Different colors for different log levels
      case "info":
        return `🟢 ${chalk.gray(timestamp)} [${chalk.green(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.green(
          labelStr
        )}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
      case "error":
        return `🔴 ${chalk.gray(timestamp)} [${chalk.red(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.red(
          labelStr
        )}]: ${chalk.greenBright(message)} ${chalk.redBright(metaStr)}`;
      case "warn":
        return `🟡 ${chalk.gray(timestamp)} [${chalk.yellow(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.yellow(
          labelStr
        )}]: ${chalk.greenBright(message)} ${chalk.yellowBright(metaStr)}`;
      default:
        return `${chalk.gray(timestamp)} [${chalk.green(
          level.toUpperCase()
        )}] [${chalk.cyanBright("APP")}: ${chalk.green(
          labelStr
        )}]: ${chalk.greenBright(message)} ${chalk.greenBright(metaStr)}`;
    }
  })
);

// ------------------------------------------------------
// 3️⃣ Configure transports based on environment
// ------------------------------------------------------
if (config.NODE_ENV !== "production" && config.NODE_ENV !== "test") {
  // Console transport for non-production environments
  transports.push(
    new winston.transports.Console({
      format: customFormat,
      level: "info",
    })
  );
} else {
  // File transports for production environment
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
    })
  );

  // Error log file transport for production environment
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "errors.log"),
      level: "error",
    })
  );

  // Combined log file transport for production environment
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    })
  );
}

// ------------------------------------------------------
// 4️⃣ Create and export the logger instance
// ------------------------------------------------------
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: customFormat,
  transports,
  silent: config.NODE_ENV === "test",
});

export default logger;

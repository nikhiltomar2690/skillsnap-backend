// // logger.js
// import { createLogger, format, transports } from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";

// const { combine, timestamp, printf } = format;

// // Custom log format for file logging
// const fileLogFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} [${level.toUpperCase()}]: ${message}`;
// });

// // Create a Winston logger with daily rotation and custom formats
// const logger = createLogger({
//   level: "info",
//   format: combine(timestamp(), fileLogFormat),
//   transports: [
//     // Console transport with colorized output
//     new transports.Console({
//       format: format.combine(
//         format.colorize(),
//         format.printf(({ level, message }) => `${level}: ${message}`)
//       ),
//     }),
//     // File transport with daily rotation and log retention of 3 days
//     new DailyRotateFile({
//       filename: "logs/app-%DATE%.log",
//       datePattern: "YYYY-MM-DD",
//       maxFiles: "3d", // Keep logs for 3 days
//       format: fileLogFormat,
//     }),
//   ],
// });

// export default logger;

import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf } = format;

// Custom log format for console logging
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger for console logging
const logger = createLogger({
  level: "info",
  format: combine(timestamp(), consoleLogFormat),
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message }) => `${level}: ${message}`)
      ),
    }),
  ],
});

export default logger;

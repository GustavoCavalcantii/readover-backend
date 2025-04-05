import winston from "winston";
import path from "path";
import fs from "fs";

const logsDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const logPath = path.join(logsDirectory, "app.log");

const addEmote = (level: string): string => {
  switch (level) {
    case "info":
      return "ℹ️ ";
    case "warn":
      return "⚠️ ";
    case "error":
      return "❌";
    case "debug":
      return "🔍";
    default:
      return "📝";
  }
};

const Logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const emote = addEmote(level);
      const coloredLevel = winston.format.colorize().colorize(level, level);
      return `${timestamp} ${emote} ${coloredLevel} : ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          const emote = addEmote(level);
          const coloredLevel = winston.format.colorize().colorize(level, level);
          return `${timestamp} ${emote} ${coloredLevel} : ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: logPath,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          const emote = addEmote(level);
          return `${timestamp} ${emote} ${level} : ${message}`;
        })
      ),
    }),
  ],
});

export default Logger;

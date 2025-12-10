import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "../../config";

const loggerTransports = [];
if (!env.PRODUCTION || true) {
  loggerTransports.push(new winston.transports.Console());
}
loggerTransports.push(
  new DailyRotateFile({
    filename: `${env.PRODUCTION ? "./" : "dev_"}logs/application-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
  })
);
const logger: any = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: loggerTransports,
});

export { logger };

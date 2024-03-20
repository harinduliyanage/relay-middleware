/**
 * @file logger
 * @summary logger service for the entire application
 */
import * as winston from "winston";
import config from "./config";
import * as LokiTransport from "winston-loki";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const transports = [
  new winston.transports.Console({
    stderrLevels: ["error"],
  }),
];

//
const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
      enumerateErrorFormat(),
      // prevent colorization to prevent log levels getting colorized. when the logs are colorized it is hard make them usable in grafana.
      // eg: log level "info" turns into \"u001b[32minfo\u001b[39m". when colorization is
      // config.env === "development"
      //     ? winston.format.colorize()
      //     : winston.format.uncolorize(),
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.json(), // Log objects as JSON
      winston.format.printf(
          ({ level, message, timestamp, ...meta }) => {
            // Include the properties of the meta object in the log message
            const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `${timestamp} : ${level}: ${message} ${metaString}`;
          }
      )
  ),
  transports: transports,
});

export default logger;

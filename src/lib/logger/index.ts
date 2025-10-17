/** biome-ignore-all lint/suspicious/noExplicitAny: *** */
/** biome-ignore-all lint/correctness/noUnusedVariables: *** */

import "../../env/config";

import winston from "winston";
import { db } from "@/drizzle/db";
import { DrizzleTransport } from "./transports/drizzle-transport";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    json(), // Format logs as JSON
  ),
  transports: [
    // ...(process.env.NODE_ENV !== "production"
    //   ? [
    //       new winston.transports.Console({
    //         format: combine(colorize({ all: true }), logFormat),
    //       }),
    //     ]
    //   : []),
    new DrizzleTransport({ db: db, level: "info" }), // Use the custom Drizzle transport
  ],
});

import { randomUUID } from "node:crypto";

import pino from "pino";
import pinoHttp from "pino-http";

import { Env } from "@/shared/config";

export const logger = pino({
  level: Env.logLevel,
  enabled: Env.nodeEnv !== "test",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
      "password",
      "token",
      "refreshToken",
      "secret",
      "apiKey",
    ],
    censor: "[REDACTED]",
  },
  ...(Env.nodeEnv === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        },
      }
    : {}),
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (request) => request.headers["x-request-id"]?.toString() ?? randomUUID(),
  redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"],
});

export class Logger {
  public static info(message: string, meta?: Record<string, unknown>): void {
    logger.info(meta, message);
  }

  public static warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(meta, message);
  }

  public static error(message: string, meta?: Record<string, unknown>): void {
    logger.error(meta, message);
  }

  public static debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(meta, message);
  }

  public static http(message: string, meta?: Record<string, unknown>): void {
    logger.info({ ...meta, channel: "http" }, message);
  }
}

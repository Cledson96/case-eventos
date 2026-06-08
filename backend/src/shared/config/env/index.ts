import dotenv from "dotenv";
import { z } from "zod";

function resolveEnvFile(): string {
  const explicitFile = process.env.ENV_FILE;

  if (explicitFile) {
    return explicitFile;
  }

  return process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev";
}

dotenv.config({ path: resolveEnvFile(), quiet: true });

const optionalStringSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional()
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  HOST: z.string().default("0.0.0.0"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000,http://127.0.0.1:3000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(1000),
  BODY_LIMIT: z.string().default("10mb"),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().trim().min(1, "DATABASE_URL e obrigatoria"),
  REDIS_URL: optionalStringSchema,
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(60),
});

const parsedEnv = envSchema.parse(process.env);
const displayHost = parsedEnv.HOST === "0.0.0.0" ? "localhost" : parsedEnv.HOST;

const Env = Object.freeze({
  nodeEnv: parsedEnv.NODE_ENV,
  port: parsedEnv.PORT,
  host: parsedEnv.HOST,
  baseUrl: `http://${displayHost}:${parsedEnv.PORT}`,
  allowedOrigins: parsedEnv.ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimitWindowMs: parsedEnv.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: parsedEnv.RATE_LIMIT_MAX,
  bodyLimit: parsedEnv.BODY_LIMIT,
  logLevel: parsedEnv.LOG_LEVEL,
  databaseUrl: parsedEnv.DATABASE_URL,
  redisUrl: parsedEnv.REDIS_URL,
  cacheTtlSeconds: parsedEnv.CACHE_TTL_SECONDS,
});

export default Env;

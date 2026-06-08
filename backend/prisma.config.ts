import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const envFile =
  process.env.ENV_FILE ?? (process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev");

dotenv.config({ path: envFile, quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

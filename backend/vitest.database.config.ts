import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const defaultDatabaseTestUrl =
  "postgresql://case_eventos:case_eventos@localhost:5432/case_eventos?schema=test";

process.env.NODE_ENV = "test";
process.env.API_TOKEN ??= "case-eventos-test-token";
process.env.DATABASE_URL =
  process.env.DATABASE_TEST_URL ?? process.env.DATABASE_URL ?? defaultDatabaseTestUrl;
process.env.REDIS_URL ??= "";
process.env.CACHE_TTL_SECONDS ??= "60";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    fileParallelism: false,
    include: ["tests/database/**/*.test.ts"],
    testTimeout: 30000,
  },
});

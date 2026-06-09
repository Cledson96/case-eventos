import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    env: {
      NODE_ENV: "test",
      BASE_URL: "http://localhost:3333",
    },
    exclude: ["tests/database/**", "node_modules/**", "dist/**", "coverage/**"],
    globals: false,
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/generated/**", "src/**/*.d.ts", "src/index.ts"],
    },
  },
});

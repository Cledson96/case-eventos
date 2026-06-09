import { afterEach, describe, expect, it, vi } from "vitest";

const originalEnv = { ...process.env };

async function loadEnv(overrides: NodeJS.ProcessEnv = {}) {
  vi.resetModules();

  const nextEnv = {
    ...originalEnv,
    ENV_FILE: ".env.test-missing",
    NODE_ENV: "test",
    PORT: "3333",
    HOST: "0.0.0.0",
    API_TOKEN: "case-eventos-test-token",
    DATABASE_URL:
      "postgresql://case_eventos:case_eventos@localhost:5432/case_eventos?schema=public",
    ...overrides,
  };

  if (!("BASE_URL" in overrides)) {
    delete nextEnv.BASE_URL;
  }

  process.env = {
    ...nextEnv,
  };

  const { default: Env } = await import("@/shared/config/env");

  return Env;
}

describe("Env", () => {
  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("deve usar BASE_URL como URL publica da API quando informado", async () => {
    const Env = await loadEnv({
      BASE_URL: "https://api-case-eventos-dev.cledson.com.br",
    });

    expect(Env.baseUrl).toBe("https://api-case-eventos-dev.cledson.com.br");
  });

  it("deve manter URL local como fallback quando BASE_URL nao for informado", async () => {
    const Env = await loadEnv();

    expect(Env.baseUrl).toBe("http://localhost:3333");
  });
});

import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "@/server";

describe("Health e documentacao HTTP", () => {
  it("deve retornar status da API em /health", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });

  it("deve retornar especificacao OpenAPI em /docs.json", async () => {
    const response = await request(app).get("/docs.json").expect(200);

    expect(response.body.openapi).toBe("3.0.0");
    expect(response.body.info.title).toBe("Case Eventos API");
    expect(response.body.paths).toHaveProperty("/events");
    expect(response.body.paths).toHaveProperty("/participants");
  });
});

import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "@/server";
import { authHeader } from "./helpers/auth";

describe("Auth HTTP", () => {
  it("deve bloquear rotas de dominio sem token", async () => {
    const response = await request(app).get("/events?sort=invalido").expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Token de acesso nao informado");
    expect(response.body.error.code).toBe(401);
  });

  it("deve bloquear rotas de dominio com token invalido", async () => {
    const response = await request(app)
      .get("/events?sort=invalido")
      .set("Authorization", "Bearer token-invalido")
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Token de acesso invalido");
    expect(response.body.error.code).toBe(401);
  });

  it("deve permitir validacao da rota quando o token for valido", async () => {
    const response = await request(app).get("/events?sort=invalido").set(authHeader).expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Dados da requisicao invalidos");
    expect(response.body.error.code).toBe(400);
  });
});

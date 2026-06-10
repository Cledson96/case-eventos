import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z, ZodError } from "zod";

import { validateRequest } from "@/shared/middlewares";

describe("validateRequest", () => {
  it("deve validar body, query e params e salvar dados parseados em locals", async () => {
    const app = express();

    app.use(express.json());
    app.post(
      "/items/:id",
      validateRequest({
        body: z.object({ name: z.string().trim() }),
        query: z.object({ page: z.coerce.number().int().positive() }),
        params: z.object({ id: z.uuid() }),
      }),
      (_request, response) => {
        response.status(200).json(response.locals.validatedRequest);
      }
    );

    const response = await request(app)
      .post("/items/7f4ad2bd-df21-4eb5-8d51-43795ce7e865?page=2")
      .send({ name: " Ana " })
      .expect(200);

    expect(response.body.body).toEqual({ name: "Ana" });
    expect(response.body.query).toEqual({ page: 2 });
    expect(response.body.params).toEqual({ id: "7f4ad2bd-df21-4eb5-8d51-43795ce7e865" });
  });

  it("deve encaminhar ZodError quando a validacao falhar", async () => {
    const app = express();

    app.use(express.json());
    app.post(
      "/items",
      validateRequest({
        body: z.object({ name: z.string({ error: "Nome e obrigatorio" }) }),
      }),
      (_request, response) => {
        response.status(200).json(response.locals.validatedRequest);
      }
    );
    app.use(
      (
        error: unknown,
        _request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        response.status(error instanceof ZodError ? 400 : 500).json({
          isZodError: error instanceof ZodError,
        });
      }
    );

    const response = await request(app).post("/items").send({}).expect(400);

    expect(response.body.isZodError).toBe(true);
  });
});

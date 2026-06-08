import { describe, expect, it } from "vitest";
import { z } from "zod";

import { getSwaggerSpec } from "@/shared/config/swagger";

const swaggerSpecSchema = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string(),
    version: z.string(),
  }),
  paths: z.record(z.string(), z.unknown()),
});

const errorExampleSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.number(),
    details: z.unknown().optional(),
  }),
  timestamp: z.string(),
});

const participantErrorsSpecSchema = z.object({
  paths: z.object({
    "/participants": z.object({
      post: z.object({
        responses: z.object({
          "400": z.object({
            content: z.object({
              "application/json": z.object({
                example: errorExampleSchema,
              }),
            }),
          }),
          "409": z.object({
            content: z.object({
              "application/json": z.object({
                example: errorExampleSchema,
              }),
            }),
          }),
        }),
      }),
    }),
  }),
});

describe("SwaggerSpec", () => {
  it("deve gerar especificacao OpenAPI com os endpoints principais", () => {
    const spec = swaggerSpecSchema.parse(getSwaggerSpec());

    expect(spec.openapi).toBe("3.0.0");
    expect(spec.info.title).toBe("Case Eventos API");
    expect(spec.paths).toHaveProperty("/events");
    expect(spec.paths).toHaveProperty("/events/{eventId}");
    expect(spec.paths).toHaveProperty("/events/{eventId}/participants");
    expect(spec.paths).toHaveProperty("/participants");
  });

  it("deve documentar exemplos de erro com mensagem e status corretos", () => {
    const spec = participantErrorsSpecSchema.parse(getSwaggerSpec());
    const postParticipants = spec.paths["/participants"].post;
    const validationExample = postParticipants.responses["400"].content["application/json"].example;
    const conflictExample = postParticipants.responses["409"].content["application/json"].example;

    expect(validationExample.message).toBe("Dados da requisicao invalidos");
    expect(validationExample.error.code).toBe(400);
    expect(conflictExample.message).toBe("E-mail ja cadastrado");
    expect(conflictExample.error.code).toBe(409);
  });
});

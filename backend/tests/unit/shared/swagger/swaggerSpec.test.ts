import { describe, expect, it } from "vitest";
import { z } from "zod";

import { getSwaggerSpec } from "@/shared/config/swagger";

const swaggerSpecSchema = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string(),
    version: z.string(),
  }),
  components: z.object({
    securitySchemes: z.object({
      bearerAuth: z.object({
        type: z.string(),
        scheme: z.string(),
      }),
    }),
  }),
  security: z.array(z.record(z.string(), z.array(z.unknown()))),
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

const protectedOperationsSpecSchema = z.object({
  components: z.object({
    responses: z.object({
      UnauthorizedError: z.object({
        description: z.string(),
        content: z.object({
          "application/json": z.object({
            example: errorExampleSchema,
          }),
        }),
      }),
    }),
  }),
  paths: z.record(
    z.string(),
    z.record(
      z.string(),
      z.object({
        responses: z.record(
          z.string(),
          z.union([
            z.object({
              $ref: z.string(),
            }),
            z.object({
              description: z.string(),
              content: z
                .object({
                  "application/json": z.object({
                    schema: z.unknown(),
                    example: z.unknown().optional(),
                  }),
                })
                .optional(),
            }),
          ])
        ),
      })
    )
  ),
});

describe("SwaggerSpec", () => {
  it("deve gerar especificacao OpenAPI com os endpoints principais", () => {
    const spec = swaggerSpecSchema.parse(getSwaggerSpec());

    expect(spec.openapi).toBe("3.0.0");
    expect(spec.info.title).toBe("Case Eventos API");
    expect(spec.components.securitySchemes.bearerAuth.type).toBe("http");
    expect(spec.components.securitySchemes.bearerAuth.scheme).toBe("bearer");
    expect(spec.security).toContainEqual({ bearerAuth: [] });
    expect(spec.paths).toHaveProperty("/events");
    expect(spec.paths).toHaveProperty("/events/{eventId}");
    expect(spec.paths).toHaveProperty("/events/{eventId}/participants");
    expect(spec.paths).toHaveProperty("/participants");
    expect(spec.paths).toHaveProperty("/participants/{participantId}");
    expect(spec.paths["/events/{eventId}"]).toHaveProperty("delete");
    expect(spec.paths["/participants/{participantId}"]).toHaveProperty("delete");
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

  it("deve documentar erro de autenticacao nas rotas protegidas", () => {
    const spec = protectedOperationsSpecSchema.parse(getSwaggerSpec());
    const unauthorizedResponse = spec.components.responses.UnauthorizedError;
    const protectedOperations = [
      spec.paths["/events"]?.post,
      spec.paths["/events"]?.get,
      spec.paths["/events/{eventId}"]?.get,
      spec.paths["/events/{eventId}"]?.delete,
      spec.paths["/events/{eventId}/participants"]?.post,
      spec.paths["/events/{eventId}/participants"]?.get,
      spec.paths["/participants"]?.post,
      spec.paths["/participants"]?.get,
      spec.paths["/participants/{participantId}"]?.delete,
    ];

    expect(unauthorizedResponse.description).toBe("Token de acesso ausente ou invalido");
    expect(unauthorizedResponse.content["application/json"].example).toEqual(
      expect.objectContaining({
        success: false,
        message: "Token de acesso nao informado",
        error: {
          code: 401,
        },
      })
    );

    for (const operation of protectedOperations) {
      expect(operation?.responses["401"]).toEqual(
        expect.objectContaining({
          $ref: "#/components/responses/UnauthorizedError",
        })
      );
    }
  });
});

import swaggerJsdoc from "swagger-jsdoc";

import Env from "../env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Case Eventos API",
      version: "1.0.0",
      description: "Documentacao da API para gerenciamento de eventos e participantes",
    },
    servers: [
      {
        url: Env.baseUrl,
        description:
          Env.nodeEnv === "production" ? "Servidor de Producao" : "Servidor de Desenvolvimento",
      },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "API Token",
          description: "Token enviado no header Authorization como Bearer <token>.",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token de acesso ausente ou invalido",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Token de acesso nao informado",
                error: {
                  code: 401,
                },
                timestamp: "2026-06-08T20:28:08.222Z",
              },
            },
          },
        },
      },
      schemas: {
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operacao realizada com sucesso" },
            data: { type: "object", description: "Dados retornados" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Mensagem do erro" },
            error: {
              type: "object",
              properties: {
                code: { type: "number", example: 400 },
                details: { type: "object" },
              },
            },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Dados da requisicao invalidos" },
            error: {
              type: "object",
              properties: {
                code: { type: "number", example: 400 },
                details: { type: "object" },
              },
            },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 50 },
            totalPages: { type: "integer", example: 3 },
          },
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Tech Summit" },
            description: { type: "string", example: "Evento de tecnologia" },
            date: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Participant: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Ana Souza" },
            email: { type: "string", format: "email", example: "ana@email.com" },
            phone: { type: "string", example: "11999999999" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        EventParticipant: {
          type: "object",
          properties: {
            eventId: { type: "string", format: "uuid" },
            participantId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        EventParticipantItem: {
          allOf: [
            { $ref: "#/components/schemas/Participant" },
            {
              type: "object",
              properties: {
                registeredAt: { type: "string", format: "date-time" },
              },
            },
          ],
        },
      },
    },
  },
  apis: [
    "./src/modules/**/*.ts",
    "./src/shared/routes/**/*.ts",
    "./dist/modules/**/*.js",
    "./dist/shared/routes/**/*.js",
  ],
};

export function getSwaggerSpec(): object {
  return swaggerJsdoc(options);
}

import type { Application, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import { getSwaggerSpec } from "@/shared/config/swagger";
import { AppDate, Logger } from "@/shared/utils";

function noCacheMiddleware(_request: Request, response: Response, next: NextFunction): void {
  response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");
  response.setHeader("Last-Modified", AppDate.httpDate());
  next();
}

function swaggerJsonHandler(_request: Request, response: Response): void {
  try {
    response.setHeader("Content-Type", "application/json");
    response.json(getSwaggerSpec());
  } catch (error) {
    Logger.error("Erro ao gerar especificacao Swagger", { error });
    response.status(500).json({ error: "Erro ao gerar especificacao Swagger" });
  }
}

export function setupSwagger(app: Application): void {
  app.get("/docs.json", noCacheMiddleware, swaggerJsonHandler);

  app.use(
    "/docs",
    noCacheMiddleware,
    swaggerUi.serve,
    swaggerUi.setup(getSwaggerSpec(), {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Case Eventos API - Documentacao",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
      },
    })
  );
}

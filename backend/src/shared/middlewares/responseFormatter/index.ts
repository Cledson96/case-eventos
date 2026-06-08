import type { NextFunction, Request, Response } from "express";

import { AppDate } from "@/shared/utils";

declare global {
  namespace Express {
    interface Response {
      success(data?: unknown, message?: string, statusCode?: number): void;
      created(data?: unknown, message?: string): void;
      error(message: string, statusCode?: number, details?: unknown): void;
      notFound(message?: string): void;
      unauthorized(message?: string): void;
      forbidden(message?: string): void;
      badRequest(message?: string, details?: unknown): void;
    }
  }
}

export function responseFormatter(_request: Request, response: Response, next: NextFunction): void {
  response.success = (
    data?: unknown,
    message = "Operacao realizada com sucesso",
    statusCode = 200
  ): void => {
    response.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: AppDate.nowIso(),
    });
  };

  response.created = (data?: unknown, message = "Recurso criado com sucesso"): void => {
    response.success(data, message, 201);
  };

  response.error = (message: string, statusCode = 500, details?: unknown): void => {
    const payload =
      details === undefined
        ? {
            success: false,
            message,
            error: {
              code: statusCode,
            },
            timestamp: AppDate.nowIso(),
          }
        : {
            success: false,
            message,
            error: {
              code: statusCode,
              details,
            },
            timestamp: AppDate.nowIso(),
          };

    response.status(statusCode).json(payload);
  };

  response.notFound = (message = "Recurso nao encontrado"): void => {
    response.error(message, 404);
  };

  response.unauthorized = (message = "Nao autorizado"): void => {
    response.error(message, 401);
  };

  response.forbidden = (message = "Acesso negado"): void => {
    response.error(message, 403);
  };

  response.badRequest = (message = "Requisicao invalida", details?: unknown): void => {
    response.error(message, 400, details);
  };

  next();
}

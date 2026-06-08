import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { Env } from "@/shared/config";
import { HttpError } from "@/shared/errors";
import { Logger } from "@/shared/utils";

export function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    response.badRequest("Dados da requisicao invalidos", error.flatten());
    return;
  }

  if (error instanceof HttpError) {
    const details = Env.nodeEnv === "production" ? undefined : error.details;
    response.error(error.message, error.statusCode, details);
    return;
  }

  Logger.error("Erro tratado pelo middleware global", {
    requestId: request.requestId,
    error,
  });

  const details =
    Env.nodeEnv === "production" || !(error instanceof Error) ? undefined : error.stack;
  response.error("Erro interno do servidor", 500, details);
}

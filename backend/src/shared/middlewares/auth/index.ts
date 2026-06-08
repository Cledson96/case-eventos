import { timingSafeEqual } from "node:crypto";

import type { RequestHandler } from "express";

import { Env } from "@/shared/config";
import { UnauthorizedError } from "@/shared/errors";

function tokenMatches(receivedToken: string): boolean {
  const expectedTokenBuffer = Buffer.from(Env.apiToken);
  const receivedTokenBuffer = Buffer.from(receivedToken);

  if (expectedTokenBuffer.length !== receivedTokenBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedTokenBuffer, receivedTokenBuffer);
}

export const authenticateApiToken: RequestHandler = (request, _response, next) => {
  try {
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedError("Token de acesso nao informado");
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token || !tokenMatches(token)) {
      throw new UnauthorizedError("Token de acesso invalido");
    }

    next();
  } catch (error) {
    next(error);
  }
};

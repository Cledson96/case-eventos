import type { Request, Response } from "express";

export function notFoundHandler(_request: Request, response: Response): void {
  response.notFound("Rota nao encontrada");
}

import { HttpError } from "../HttpError";

export class BadRequestError extends HttpError {
  public constructor(message = "Requisicao invalida", details?: unknown) {
    super(message, 400, details);
  }
}

import { HttpError } from "../HttpError";

export class NotFoundError extends HttpError {
  public constructor(message = "Recurso nao encontrado", details?: unknown) {
    super(message, 404, details);
  }
}

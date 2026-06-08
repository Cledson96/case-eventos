import { HttpError } from "../HttpError";

export class ForbiddenError extends HttpError {
  public constructor(message = "Acesso negado", details?: unknown) {
    super(message, 403, details);
  }
}

import { HttpError } from "../HttpError";

export class UnauthorizedError extends HttpError {
  public constructor(message = "Nao autorizado", details?: unknown) {
    super(message, 401, details);
  }
}

import { HttpError } from "../HttpError";

export class ConflictError extends HttpError {
  public constructor(message = "Conflito ao processar recurso", details?: unknown) {
    super(message, 409, details);
  }
}

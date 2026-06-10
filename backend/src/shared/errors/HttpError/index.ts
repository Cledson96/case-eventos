export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details: unknown | undefined;

  public constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ExpressError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);

    this.name = "ExpressError";
    this.status = status;

    // Maintains proper stack trace
    Error.captureStackTrace?.(this, ExpressError);
  }

  static badRequest(message: string) {
    return new ExpressError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ExpressError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ExpressError(403, message);
  }

  static notFound(message = "NOT FOUND") {
    return new ExpressError(404, message);
  }

  static conflict(message: string) {
    return new ExpressError(409, message);
  }

  static internal(message = "Internal Server Error") {
    return new ExpressError(500, message);
  }
}

export default ExpressError;

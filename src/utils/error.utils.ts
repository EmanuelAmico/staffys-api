class APIError extends Error {
  public declare message: string;
  public status = 500;

  constructor({ message, status }: { message: string; status?: number }) {
    super(message);
    this.name = "APIError";
    if (status) this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { APIError };

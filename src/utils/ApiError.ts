class ApiError extends Error {
  statusCode: number;
  error: unknown[];

  constructor(
    statusCode: number,
    message = "something went wrong",
    error: unknown[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}

export { ApiError };

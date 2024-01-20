export class ApiError extends Error {
  status: number;
  error: unknown;
  constructor(status: number, message: string, error: unknown) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

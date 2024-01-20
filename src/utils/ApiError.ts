export class ApiError extends Error {
  status: number;
  error: unknown;
  sucess: boolean;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.sucess = false;
  }
}

export class ApiResponse {
  status: number;
  message: string;
  data: unknown;
  constructor(status: number, message: string, data: unknown) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

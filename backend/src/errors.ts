/**
 * Custom error class for application errors.
 * 
 * @param message - The error message.
 * @param statusCode - The HTTP status code.
 */
export class AppError extends Error {
  status: number;
  data: any;
  constructor(message: string, statusCode = 400, data: any = []) {
    super(message);
    this.name = 'AppError';
    this.status = statusCode;
    this.data = data;
  }
}

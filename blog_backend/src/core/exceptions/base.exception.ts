import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseException extends HttpException {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    context?: Record<string, unknown>,
  ) {
    super(message, statusCode);
    this.code = code;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.getStatus(),
      timestamp: new Date().toISOString(),
      context: this.context,
    };
  }
}

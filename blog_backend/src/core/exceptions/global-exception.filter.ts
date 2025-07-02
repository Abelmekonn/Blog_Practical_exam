import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from './base.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, code, context } = this.getErrorDetails(exception);

    // Log the error
    const errorData = {
      statusCode: status,
      message,
      code,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      context,
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
        'GlobalExceptionFilter',
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${message}`,
        'GlobalExceptionFilter',
      );
    }

    // Send error response
    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        code,
        timestamp: errorData.timestamp,
        path: request.url,
        ...(process.env.NODE_ENV === 'development' && { context }),
      },
    });
  }

  private getErrorDetails(exception: unknown): {
    status: number;
    message: string;
    code: string;
    context?: Record<string, unknown>;
  } {
    // Handle custom base exceptions
    if (exception instanceof BaseException) {
      return {
        status: exception.getStatus(),
        message: exception.message,
        code: exception.code,
        context: exception.context,
      };
    }

    // Handle built-in HTTP exceptions
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      let message: string;

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }

      return {
        status: exception.getStatus(),
        message,
        code: 'HTTP_EXCEPTION',
      };
    }

    // Handle unexpected errors
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : exception.message,
        code: 'INTERNAL_SERVER_ERROR',
        context:
          process.env.NODE_ENV === 'development'
            ? { stack: exception.stack }
            : undefined,
      };
    }

    // Handle unknown exceptions
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      context:
        process.env.NODE_ENV === 'development'
          ? { exception: String(exception) }
          : undefined,
    };
  }
}

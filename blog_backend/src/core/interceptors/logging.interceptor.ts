import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, headers, body, query, params } = request;

    // Log request details
    const requestLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      userAgent: headers['user-agent'],
      ip: request.ip,
      contentLength: headers['content-length'],
      query: Object.keys(query).length > 0 ? query : undefined,
      params: Object.keys(params).length > 0 ? params : undefined,
      // Don't log body for security reasons in production
      ...(process.env.NODE_ENV === 'development' && { body }),
    };

    this.logger.log(`➡️  ${method} ${url}`, JSON.stringify(requestLog));

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - now;
          const responseLog = {
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            dataSize: JSON.stringify(data).length,
          };

          this.logger.log(
            `⬅️  ${method} ${url} ${response.statusCode} - ${responseTime}ms`,
            JSON.stringify(responseLog),
          );
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          const errorLog = {
            timestamp: new Date().toISOString(),
            method,
            url,
            error: error.message,
            statusCode: error.status || 500,
            responseTime: `${responseTime}ms`,
          };

          this.logger.error(
            `❌ ${method} ${url} ${error.status || 500} - ${responseTime}ms`,
            JSON.stringify(errorLog),
          );
        },
      }),
    );
  }
}

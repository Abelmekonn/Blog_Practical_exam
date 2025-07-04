// Base interfaces and abstractions
export * from './base/base.repository.interface';

// CQRS patterns
export * from './cqrs/command.base';
export * from './cqrs/query.base';

// Exception handling
export * from './exceptions';

// Interceptors
export * from './interceptors/logging.interceptor';
export * from './interceptors/response-transform.interceptor';

// Pipes
export * from './pipes/validation.pipe';

// Decorators
export * from './decorators/api-response.decorator';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

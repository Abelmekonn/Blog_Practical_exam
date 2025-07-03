import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export interface StandardApiResponseOptions {
  status: number;
  description: string;
  type?: Type<any> | Type<unknown> | [Type<unknown>] | string;
  isArray?: boolean;
}

// Helper function to get type name safely
function getTypeName(
  type: Type<any> | Type<unknown> | [Type<unknown>] | string,
): string {
  if (typeof type === 'string') {
    return type;
  }
  if (Array.isArray(type)) {
    return type[0]?.name || 'object';
  }
  if (typeof type === 'function') {
    return type.name || 'object';
  }
  return 'object';
}

export function StandardApiResponse(options: StandardApiResponseOptions) {
  const typeName = options.type ? getTypeName(options.type) : 'object';

  const responseSchema = {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      data: options.type
        ? options.isArray
          ? {
              type: 'array',
              items: { $ref: `#/components/schemas/${typeName}` },
            }
          : { $ref: `#/components/schemas/${typeName}` }
        : { type: 'object' },
      message: {
        type: 'string',
        example: 'Request processed successfully',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00.000Z',
      },
      path: {
        type: 'string',
        example: '/api/posts',
      },
      statusCode: {
        type: 'number',
        example: options.status,
      },
    },
  };

  const apiResponseOptions: ApiResponseOptions = {
    status: options.status,
    description: options.description,
    schema: responseSchema,
  };

  return applyDecorators(ApiResponse(apiResponseOptions));
}

export function StandardErrorResponse(status: number, description: string) {
  const errorSchema = {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: status,
          },
          message: {
            type: 'string',
            example: description,
          },
          code: {
            type: 'string',
            example: 'ERROR_CODE',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
          path: {
            type: 'string',
            example: '/api/posts',
          },
        },
      },
    },
  };

  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: errorSchema,
    }),
  );
}

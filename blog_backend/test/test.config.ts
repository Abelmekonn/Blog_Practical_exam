import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/core/exceptions/global-exception.filter';

export class TestConfig {
  static async createTestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    // Apply the same configuration as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.enableCors();

    await app.init();
    return app;
  }

  static getTestUser(suffix = '') {
    return {
      email: `test${suffix}@example.com`,
      password: 'password123',
      name: `Test User${suffix}`,
    };
  }

  static getTestPost() {
    return {
      title: 'Test Post Title',
      content:
        'This is a comprehensive test post content that should be long enough to test various scenarios.',
      imageUrl: 'https://example.com/test-image.jpg',
      imagePublicId: 'test-image-public-id',
    };
  }

  static getTestComment(postId: string) {
    return {
      content:
        'This is a test comment with sufficient content for testing purposes.',
      postId,
    };
  }

  static getValidationTestCases() {
    return {
      email: {
        valid: [
          'test@example.com',
          'user.name@domain.co.uk',
          'test+tag@example.org',
        ],
        invalid: ['invalid-email', '@domain.com', 'test@', 'test@.com', ''],
      },
      password: {
        valid: ['password123', 'strongP@ssw0rd!', 'mySecurePass456'],
        invalid: ['123', 'short', '', 'a'.repeat(256)],
      },
      name: {
        valid: ['John Doe', 'Alice', 'Bob Smith Jr.', 'María García'],
        invalid: ['', 'a'.repeat(256)],
      },
    };
  }

  static getSecurityTestCases() {
    return {
      xss: [
        '<script>alert("xss")</script>',
        '"><script>alert("xss")</script>',
        "javascript:alert('xss')",
        '<img src=x onerror=alert("xss")>',
      ],
      sqlInjection: [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        '1; DELETE FROM posts; --',
        "admin'--",
      ],
      commandInjection: [
        '; rm -rf /',
        '| cat /etc/passwd',
        '$(whoami)',
        '`ls -la`',
      ],
    };
  }
}

export const TEST_CONSTANTS = {
  DEFAULT_TIMEOUT: 30000,
  LONG_TIMEOUT: 60000,
  SHORT_TIMEOUT: 5000,

  VALID_JWT_REGEX: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  UUID_REGEX:
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    VALIDATION_FAILED: 'Validation failed',
  },
} as const;

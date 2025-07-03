import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './core/exceptions/global-exception.filter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files for uploaded images
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have any decorators
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert primitive types
      },
    }),
  );

  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription(
      `
      ## Professional Blog Backend API
      
      A comprehensive blog platform built with Clean Architecture and CQRS patterns.
      
      ### Features
      - 🔐 **Authentication**: JWT-based secure authentication
      - 📝 **Posts Management**: Full CRUD operations with image support
      - 💬 **Comments System**: Threaded comments with moderation
      - 👥 **User Management**: Profile management and user data
      - 🛡️ **Security**: Input validation, XSS protection, and authorization
      
      ### Architecture
      - Clean Architecture with Domain-Driven Design
      - CQRS (Command Query Responsibility Segregation)
      - Custom exception handling
      - Professional logging and monitoring
      
      ### Authentication
      Use the **Authorize** button to add your JWT token for secured endpoints.
    `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Blog Development Team',
      'https://yourblog.com',
      'support@yourblog.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.yourblog.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Posts', 'Blog posts management')
    .addTag('Comments', 'Comments system')
    .addTag('Users', 'User profile management')
    .addTag('Upload', 'Image upload and management')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Blog API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info h1 { color: #3b82f6 }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 5px; }
    `,
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

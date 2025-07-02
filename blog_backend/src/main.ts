import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The Blog API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!process.env.FRONTEND_URL) {
    console.log('WARNING: FRONTEND_URL is not set in environment variables.');
  }

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*', // fallback for Vercel preview/local
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('EMI Store API')
    .setDescription(
      'REST API for EMI-based smartphone e-commerce platform with flexible payment plans',
    )
    .addTag('Products', 'Product management endpoints')
    .addTag('Variants', 'Product variant management')
    .addTag('EMI Plans', 'EMI payment plan management')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Use swagger-ui-express (for Vercel live preview compatibility)
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(document, {
      customSiteTitle: 'EMI Store API Documentation',
      customfavIcon: 'https://nestjs.com/img/logo-small.svg',
      customCss: '.swagger-ui .topbar { display: none }',
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Server is running on: http://localhost:${port}`);
  console.log(`📚 Swagger Documentation: http://localhost:${port}/api/docs\n`);
}

bootstrap();

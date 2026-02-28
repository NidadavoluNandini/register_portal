import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * ✅ Allow large payloads (resume uploads, base64 files)
   */
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  /**
   * ✅ Global API Prefix
   * All routes become:
   * https://your-domain/api/...
   */
  app.setGlobalPrefix('api');

  /**
   * ✅ CORS Configuration
   * Allow frontend + local development
   */
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://candidateportal-two.vercel.app/', // 🔁 replace with your Vercel URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  /**
   * ✅ Global Validation
   * - whitelist: removes unwanted fields
   * - transform: auto converts DTO types
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  /**
   * ✅ Railway Dynamic Port Support
   */
  const PORT = process.env.PORT || 3000;

  /**
   * IMPORTANT:
   * 0.0.0.0 allows external traffic inside Railway container
   */
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Resume Portal Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
}

bootstrap();
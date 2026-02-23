import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const allowedOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):(\d+)$/;

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOriginPattern.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  await app.listen(3000);
  console.log('Backend is running');
}
bootstrap();

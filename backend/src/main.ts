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

  // ✅ Allow localhost + deployed frontend
  const allowedOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):(\d+)$/;

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOriginPattern.test(origin) ||
        origin.includes('vercel.app') // ✅ allow Vercel frontend
      ) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  // ✅ IMPORTANT: Railway dynamic port
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, '0.0.0.0');


}

bootstrap();
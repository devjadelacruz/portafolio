import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos extra que no estén en el DTO
      forbidNonWhitelisted: true, // si mandan campos extra -> error 400
      transform: true, // convierte tipos automáticamente (query params, etc)
    }),
  );

  await app.listen(3000);
}
bootstrap();

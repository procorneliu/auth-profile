import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { join } from 'path';
import cookieParser from 'cookie-parser';
import * as express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // App Configuration
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

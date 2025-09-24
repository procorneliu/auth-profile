import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { join } from 'path';
import cookieParser from 'cookie-parser';
import csfur from 'csurf';
import * as express from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // APP CONFIGURATION

  app.setGlobalPrefix('api');

  // Apply CSRF protection middleware
  app.use(csfur());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // use cookies
  app.use(cookieParser());

  // dto validation, class-validator
  app.useGlobalPipes(new ValidationPipe());

  // server image from /uploads folder
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

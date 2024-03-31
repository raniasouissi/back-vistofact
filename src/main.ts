import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
//import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
//import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your Angular app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('/api');
  await app.listen(5000);
  app.use(cookieParser());
  app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  });

  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();

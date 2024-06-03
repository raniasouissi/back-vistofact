// Importez le module path
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path'; // Importez join depuis path
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Replacez avec l'URL de votre application Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.use((err, req, res, next) => {
    // Ajoutez `next` comme dernier argument
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' }); // Utilisez `res.status()` correctement
  });

  app.useGlobalPipes(new ValidationPipe());

  // Configurez le serveur pour servir les fichiers statiques
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  console.log(__dirname); // Vérifiez le répertoire actuel du fichier main.ts
  console.log(join(__dirname, '..', 'uploads'));
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('factures') // Ajoutez des tags pour organiser les routes
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
}
bootstrap();

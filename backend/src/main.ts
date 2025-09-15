// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Active CORS pour que votre frontend puisse communiquer avec le backend
  app.enableCors();

  // On conserve votre configuration pour servir les images uploadées
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Render (ou un autre service de déploiement) fournira un port via cette variable d'environnement.
  // Si elle n'existe pas (en local), on utilise le port 3001 par défaut.
  const port = process.env.PORT || 3001;
  
  await app.listen(port);
}
bootstrap();
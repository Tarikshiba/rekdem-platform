// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'; // On importe la fonction 'join'
import { NestExpressApplication } from '@nestjs/platform-express'; // On importe le type pour Express

async function bootstrap() {
  // On spécifie que notre app utilise Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // --- NOUVELLE LIGNE ---
  // On dit à notre app de servir les fichiers statiques qui se trouvent dans le dossier 'uploads'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // On ajoute un préfixe pour que l'URL soit propre
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
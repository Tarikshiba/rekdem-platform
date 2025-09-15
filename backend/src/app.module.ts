// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DepotModule } from './depot/depot.module';
import { RouteModule } from './route/route.module';
import { CommandeModule } from './commande/commande.module';
import { TrackingModule } from './tracking/tracking.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { PaymentModule } from './payment/payment.module';

// --- NOUVELLE APPROCHE : UNE FONCTION QUI CONSTRUIT LA CONFIGURATION ---

const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    // Configuration pour la Production (Neon)
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL, // URL fournie par Neon
      autoLoadEntities: true,
      synchronize: true, // Pour la prod, on mettra `false` plus tard
      ssl: {
        rejectUnauthorized: false,
      },
    };
  } else {
    // Configuration pour le Développement (Docker local)
    return {
      type: 'postgres',
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
};


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot(getTypeOrmConfig()), // On appelle notre fonction ici
    UserModule,
    AuthModule,
    DepotModule,
    RouteModule,
    CommandeModule,
    TrackingModule,
    ConversationModule,
    MessageModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
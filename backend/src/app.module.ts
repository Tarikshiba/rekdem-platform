// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    // --- NOUVELLE CONFIGURATION POUR LA PRODUCTION ---
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Utilise l'URL de connexion fournie par Neon (ou une autre BDD de prod)
      url: process.env.DATABASE_URL, 
      autoLoadEntities: true,
      synchronize: true, // Attention: à mettre à `false` une fois le schéma stable en production
      // Options requises pour que TypeORM se connecte à Neon via SSL
      ssl: {
        rejectUnauthorized: false,
      },
    }),
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
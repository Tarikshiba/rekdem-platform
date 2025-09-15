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
    TypeOrmModule.forRoot({
      type: 'postgres',
      // On ajoute '!' pour dire à TypeScript : "cette variable existera, fais-moi confiance"
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      autoLoadEntities: true,
      synchronize: true,
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
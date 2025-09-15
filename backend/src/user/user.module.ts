// backend/src/user/user.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DepotModule } from 'src/depot/depot.module';
import { RouteModule } from 'src/route/route.module';
import { CommandeModule } from 'src/commande/commande.module';
// Imports des nouveaux modules
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => DepotModule),
    forwardRef(() => RouteModule),
    forwardRef(() => CommandeModule),
    // On ajoute les nouveaux modules
    forwardRef(() => ConversationModule),
    forwardRef(() => MessageModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
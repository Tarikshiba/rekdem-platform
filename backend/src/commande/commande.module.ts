// backend/src/commande/commande.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CommandeController } from './commande.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commande } from './entities/commande.entity';
import { UserModule } from 'src/user/user.module';
import { RouteModule } from 'src/route/route.module';
import { Route } from 'src/route/entities/route.entity';
import { Tracking } from '../tracking/entities/tracking.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageModule } from 'src/message/message.module';
import { Conversation } from 'src/conversation/entities/conversation.entity'; // On importe l'entité

@Module({
  imports: [
    // On ajoute Conversation à la liste des entités que ce module peut utiliser
    TypeOrmModule.forFeature([Commande, Route, Tracking, Conversation]),
    forwardRef(() => UserModule),
    forwardRef(() => RouteModule),
    forwardRef(() => ConversationModule),
    forwardRef(() => MessageModule),
  ],
  controllers: [CommandeController],
  providers: [CommandeService],
  exports: [CommandeService],
})
export class CommandeModule {}
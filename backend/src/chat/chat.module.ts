// backend/src/chat/chat.module.ts

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [MessageModule, ConversationModule], // On importe les modules dont le gateway dépend
  providers: [ChatGateway], // On déclare notre gateway ici
})
export class ChatModule {}
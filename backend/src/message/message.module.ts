// backend/src/message/message.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation, User]),
    forwardRef(() => ConversationModule),
    forwardRef(() => UserModule),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
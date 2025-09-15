// backend/src/chat/chat.gateway.ts

import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { Logger } from '@nestjs/common';

// On configure le Gateway pour qu'il écoute sur le port 3001 et autorise les connexions
@WebSocketGateway({
  cors: {
    origin: '*', // Pour le développement, on autorise tout le monde. À changer en production.
  },
})
export class ChatGateway {
  // On injecte le serveur WebSocket pour pouvoir envoyer des messages
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  // Cette fonction est appelée quand un client se connecte
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Cette fonction est appelée quand un client se déconnecte
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Cette fonction est appelée quand un client envoie l'événement 'joinRoom'
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string
  ): void {
    client.join(conversationId);
    this.logger.log(`Client ${client.id} joined room ${conversationId}`);
  }

  // Cette fonction est appelée quand un client envoie l'événement 'sendMessage'
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: any): Promise<void> {
    // data devrait contenir : { conversationId, senderId, text_content, message_type, file_url }
    
    // 1. On sauvegarde le nouveau message en base de données
    const newMessage = await this.messageService.create(data);

    // 2. On distribue le message à tous les clients dans la bonne "room" (la conversation)
    this.server.to(data.conversationId).emit('newMessage', newMessage);
    
    this.logger.log(`Message sent to room ${data.conversationId}`);
  }
}
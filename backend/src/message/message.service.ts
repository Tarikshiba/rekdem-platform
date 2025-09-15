// backend/src/message/message.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const { conversationId, senderId, ...messageData } = createMessageDto;

    // 1. On récupère les entités liées
    const conversation = await this.conversationRepository.findOneBy({ id: conversationId });
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID #${conversationId} not found.`);
    }

    const sender = await this.userRepository.findOneBy({ id: senderId });
    if (!sender) {
      throw new NotFoundException(`Sender with ID #${senderId} not found.`);
    }

    // 2. On crée et sauvegarde le message
    const newMessage = this.messageRepository.create({
      ...messageData,
      conversation: conversation,
      sender: sender,
    });
    
    const savedMessage = await this.messageRepository.save(newMessage);

    // 3. On retourne le message sauvegardé avec les infos de l'expéditeur
    // C'est important pour que le frontend puisse afficher le message correctement
    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
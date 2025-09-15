// backend/src/conversation/conversation.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  create(createConversationDto: CreateConversationDto) {
    // Nous implémenterons la création plus tard, lorsque nous créerons une commande
    return 'This action adds a new conversation';
  }

  findAllForUser(user: User) {
    // Trouve les conversations où l'utilisateur est soit le client, SOIT le transitaire
    return this.conversationRepository.find({
      where: [
        { client: { id: user.id } },
        { transitaire: { id: user.id } },
      ],
      // On charge les relations pour afficher les infos dans la "boîte de réception"
      relations: ['client', 'transitaire', 'commande'],
      // On pourrait ajouter un tri plus complexe plus tard
    });
  }

  async findOne(id: string, user: User) {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      // On charge toutes les relations nécessaires pour la page de chat
      relations: [
        'client', 
        'transitaire', 
        'commande', 
        'messages', 
        'messages.sender' // On charge l'expéditeur de chaque message
      ],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID #${id} not found.`);
    }

    // Sécurité : On vérifie que l'utilisateur fait bien partie de la conversation
    if (conversation.client.id !== user.id && conversation.transitaire.id !== user.id) {
      throw new UnauthorizedException("You are not authorized to view this conversation.");
    }

    // On trie les messages du plus ancien au plus récent
    if (conversation.messages) {
      conversation.messages.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
    }

    return conversation;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
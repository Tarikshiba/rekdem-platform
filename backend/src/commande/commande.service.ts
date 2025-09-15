// backend/src/commande/commande.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { Commande } from './entities/commande.entity';
import { User } from 'src/user/entities/user.entity';
import { Route } from 'src/route/entities/route.entity';
import { Tracking } from 'src/tracking/entities/tracking.entity';
import { OrderStatus } from 'src/tracking/entities/tracking.entity';
import { UserRole } from 'src/types/enums';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Injectable()
export class CommandeService {
  constructor(
    @InjectRepository(Commande)
    private readonly commandeRepository: Repository<Commande>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async create(createCommandeDto: CreateCommandeDto, client: User): Promise<Commande> {
    const { routeId, ...colisDetails } = createCommandeDto;
    
    const route = await this.routeRepository.findOne({ 
        where: { id: routeId },
        relations: ['user'] 
    });

    if (!route) {
      throw new NotFoundException(`Route with ID #${routeId} not found`);
    }

    const nouvelleCommande = this.commandeRepository.create({
      ...colisDetails,
      route: route,
      client: client,
    });
    await this.commandeRepository.save(nouvelleCommande);

    const initialTracking = this.trackingRepository.create({
      commande: nouvelleCommande,
      status: OrderStatus.PENDING,
    });
    await this.trackingRepository.save(initialTracking);
    
    const newConversation = this.conversationRepository.create({
        commande: nouvelleCommande,
        client: client,
        transitaire: route.user,
    });
    await this.conversationRepository.save(newConversation);

    nouvelleCommande.trackingHistory = [initialTracking];
    return nouvelleCommande;
  }

  async findAll(user: User): Promise<any[]> {
    const roleCondition = user.role === UserRole.TRANSITAIRE 
      ? { route: { user: { id: user.id } } }
      : { client: { id: user.id } };

    const commandes = await this.commandeRepository.find({
      relations: ['route', 'client', 'route.originDepot', 'route.destinationDepot', 'trackingHistory'],
      where: roleCondition,
      order: { created_at: 'DESC' },
    });

    return commandes.map(commande => {
      if (!commande.trackingHistory || commande.trackingHistory.length === 0) {
        return { ...commande, status: 'unknown' };
      }
      const latestTracking = [...commande.trackingHistory].sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];
      return {
        ...commande,
        status: latestTracking.status,
      };
    });
  }

  async findOne(id: string, user: User): Promise<Commande> {
    const commande = await this.commandeRepository.findOne({
        where: { id },
        relations: ['route', 'client', 'route.originDepot', 'route.destinationDepot', 'trackingHistory', 'route.user'],
    });

    if (!commande) {
        throw new NotFoundException(`Commande with ID #${id} not found.`);
    }

    const isOwner = commande.client.id === user.id;
    const isTransitaire = commande.route.user.id === user.id;

    if (user.role === UserRole.CLIENT && !isOwner) {
        throw new UnauthorizedException("You are not authorized to see this order.");
    }
    if (user.role === UserRole.TRANSITAIRE && !isTransitaire) {
        throw new UnauthorizedException("You are not authorized to see this order.");
    }
    
    if (commande.trackingHistory) {
      commande.trackingHistory.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
    }

    return commande;
  }

  async update(id: string, updateCommandeDto: UpdateCommandeDto, user: User): Promise<any> {
    const commandeToUpdate = await this.findOne(id, user);
    
    const newTracking = this.trackingRepository.create({
      commande: commandeToUpdate,
      status: updateCommandeDto.status,
    });
    await this.trackingRepository.save(newTracking);

    const finalCommande = await this.findOne(id, user);

    const latestStatus = finalCommande.trackingHistory[0]?.status || 'unknown';
    
    return { ...finalCommande, status: latestStatus };
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
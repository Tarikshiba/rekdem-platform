// backend/src/route/route.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from './entities/route.entity';
import { User } from 'src/user/entities/user.entity';
import { Depot } from 'src/depot/entities/depot.entity';
import { SubscriptionStatus } from 'src/types/enums';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
    @InjectRepository(Depot)
    private readonly depotRepository: Repository<Depot>,
  ) {}

  async create(createRouteDto: CreateRouteDto, user: User) {
    const { originDepotId, destinationDepotId, ...rest } = createRouteDto;
    const originDepot = await this.depotRepository.findOneBy({ id: originDepotId, user: { id: user.id } });
    const destinationDepot = await this.depotRepository.findOneBy({ id: destinationDepotId, user: { id: user.id } });

    if (!originDepot || !destinationDepot) {
      throw new UnauthorizedException("Un des dépôts est invalide ou ne vous appartient pas.");
    }

    const newRoute = this.routeRepository.create({
      ...rest,
      user: user,
      originDepot: originDepot,
      destinationDepot: destinationDepot,
    });

    return this.routeRepository.save(newRoute);
  }

  findAllForUser(user: User) {
    return this.routeRepository.find({
      where: { user: { id: user.id } },
      relations: ['originDepot', 'destinationDepot'],
    });
  }
  
  findAllPublic() {
    return this.routeRepository.find({
      relations: ['originDepot', 'destinationDepot', 'user'],
      where: {
        user: {
          subscription_status: SubscriptionStatus.ACTIVE,
        }
      },
    });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto, user: User) {
    const route = await this.routeRepository.findOne({ 
      where: { id, user: { id: user.id } },
      relations: ['originDepot', 'destinationDepot'],
    });

    if (!route) {
      throw new NotFoundException(`La route avec l'ID ${id} est introuvable ou ne vous appartient pas.`);
    }

    const { originDepotId, destinationDepotId, ...restOfDto } = updateRouteDto;

    if (originDepotId) {
        const originDepot = await this.depotRepository.findOneBy({ id: originDepotId, user: { id: user.id } });
        if (!originDepot) throw new UnauthorizedException("Le nouveau dépôt de départ est invalide.");
        route.originDepot = originDepot;
    }
    if (destinationDepotId) {
        const destinationDepot = await this.depotRepository.findOneBy({ id: destinationDepotId, user: { id: user.id } });
        if (!destinationDepot) throw new UnauthorizedException("Le nouveau dépôt d'arrivée est invalide.");
        route.destinationDepot = destinationDepot;
    }
    
    Object.assign(route, restOfDto);

    return this.routeRepository.save(route);
  }

  async remove(id: string, user: User) {
    const result = await this.routeRepository.delete({ id, user: { id: user.id } });

    if (result.affected === 0) {
      throw new NotFoundException(`La route avec l'ID ${id} est introuvable ou ne vous appartient pas.`);
    }
    
    return { message: `La route avec l'ID ${id} a été supprimée.` };
  }
}
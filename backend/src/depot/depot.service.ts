import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDepotDto } from './dto/create-depot.dto';
import { UpdateDepotDto } from './dto/update-depot.dto';
import { Depot } from './entities/depot.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DepotService {
  constructor(
    @InjectRepository(Depot)
    private readonly depotRepository: Repository<Depot>,
  ) {}

  create(createDepotDto: CreateDepotDto, user: User) {
    const newDepot = this.depotRepository.create({
      ...createDepotDto,
      user: user,
    });
    return this.depotRepository.save(newDepot);
  }

  findAllForUser(user: User) {
    return this.depotRepository.find({
      where: { user: { id: user.id } },
    });
  }

  // NOUVELLE MÉTHODE POUR LA MODIFICATION
  async update(id: string, updateDepotDto: UpdateDepotDto, user: User) {
    const depot = await this.depotRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!depot) {
      throw new NotFoundException(`Le dépôt avec l'ID ${id} n'a pas été trouvé.`);
    }

    if (depot.user.id !== user.id) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à modifier ce dépôt.");
    }

    Object.assign(depot, updateDepotDto);
    return this.depotRepository.save(depot);
  }

  // NOUVELLE MÉTHODE POUR LA SUPPRESSION
  async remove(id: string, user: User) {
    const depot = await this.depotRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!depot) {
      throw new NotFoundException(`Le dépôt avec l'ID ${id} n'a pas été trouvé.`);
    }

    if (depot.user.id !== user.id) {
      throw new UnauthorizedException("Vous n'êtes pas autorisé à supprimer ce dépôt.");
    }

    await this.depotRepository.remove(depot);
    return { message: `Le dépôt avec l'ID ${id} a été supprimé.` };
  }
}
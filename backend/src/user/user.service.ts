// backend/src/user/user.service.ts

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// ON IMPORTE DEPUIS LE NOUVEL EMPLACEMENT
import { UserRole } from 'src/types/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(createUserDto.password, salt);
    const { password, ...userData } = createUserDto;
    const newUser = this.userRepository.create({ ...userData, password_hash });
    const savedUser = await this.userRepository.save(newUser);
    const { password_hash: _, ...result } = savedUser;
    return result;
  }

  findAll() {
    return this.userRepository.find();
  }
  
  async findAllTransitaires() {
    return this.userRepository.find({
        select: [ 'id', 'first_name', 'last_name', 'company_name', 'country', 'city', 'profile_picture_url' ],
        where: { role: UserRole.TRANSITAIRE },
    });
  }

  async findOnePublicProfile(id: string) {
    const user = await this.userRepository.findOne({
        where: { id },
        select: {
            id: true,
            company_name: true,
            country: true,
            city: true,
            profile_bio: true,
            profile_picture_url: true,
            cover_picture_url: true,
            whatsapp_number: true,
            facebook_url: true,
            instagram_url: true,
            youtube_url: true,
            tiktok_url: true,
            telegram_url: true,
            depots: { id: true, name: true, country: true, address: true },
            routes: { id: true, mode: true, price_per_kg: true, estimated_duration_in_days: true },
        },
        relations: ['depots', 'routes'],
    });

    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: User) {
    if (id !== currentUser.id) {
        throw new UnauthorizedException("You can only update your own profile.");
    }

    const userToUpdate = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
    });

    if (!userToUpdate) {
        throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const savedUser = await this.userRepository.save(userToUpdate);

    const { password_hash, ...result } = savedUser;
    return result;
  }
  
  async updateProfilePicture(userId: string, filePath: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    user.profile_picture_url = filePath;

    const savedUser = await this.userRepository.save(user);

    const { password_hash, ...result } = savedUser;
    return result;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
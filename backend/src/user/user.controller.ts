// backend/src/user/user.controller.ts

import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  ParseUUIDPipe, UseGuards, Request, UseInterceptors, UploadedFile 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // --- NOUVELLE ROUTE POUR L'UPLOAD DE LA PHOTO DE PROFIL ---
  @Post('upload/profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads/profile-pictures', // Le dossier de sauvegarde
      filename: (req, file, callback) => {
        // Génère un nom de fichier unique pour éviter les conflits
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
        callback(null, filename);
      },
    }),
  }))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const user = req.user;
    // On appelle une nouvelle méthode dans le service pour mettre à jour l'URL
    return this.userService.updateProfilePicture(user.id, file.path);
  }


  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  
  @Get('transitaires')
  findAllTransitaires() {
    return this.userService.findAllTransitaires();
  }

  @Get(':id')
  findOnePublicProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOnePublicProfile(id);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
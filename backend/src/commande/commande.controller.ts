// backend/src/commande/commande.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateCommandeDto } from './dto/update-commande.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommandeDto: CreateCommandeDto, @Request() req) {
    const client = req.user;
    return this.commandeService.create(createCommandeDto, client);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.commandeService.findAll(req.user);
  }

  // --- MÉTHODE MODIFIÉE ---
  @UseGuards(JwtAuthGuard) // On protège la route
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    // On passe l'ID de la commande ET l'utilisateur au service pour la sécurité
    return this.commandeService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommandeDto: UpdateCommandeDto,
    @Request() req,
  ) {
    return this.commandeService.update(id, updateCommandeDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandeService.remove(id); 
  }
}
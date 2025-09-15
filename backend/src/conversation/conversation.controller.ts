// backend/src/conversation/conversation.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.conversationService.findAllForUser(req.user);
  }

  // --- ROUTE MODIFIÉE ---
  @Get(':id')
  @UseGuards(JwtAuthGuard) // On protège la route
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    // On passe l'ID et l'utilisateur au service
    return this.conversationService.findOne(id, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    // Les ID sont des UUIDs (string), on retire le `+`
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Les ID sont des UUIDs (string), on retire le `+`
    return this.conversationService.remove(+id);
  }
}
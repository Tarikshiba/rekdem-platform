import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DepotService } from './depot.service';
import { CreateDepotDto } from './dto/create-depot.dto';
import { UpdateDepotDto } from './dto/update-depot.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('depot')
@UseGuards(AuthGuard('jwt'))
export class DepotController {
  constructor(private readonly depotService: DepotService) {}

  @Post()
  create(@Body() createDepotDto: CreateDepotDto, @Req() req) {
    return this.depotService.create(createDepotDto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.depotService.findAllForUser(req.user);
  }

  // ROUTE DE MODIFICATION ACTIVÉE
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepotDto: UpdateDepotDto, @Req() req) {
    return this.depotService.update(id, updateDepotDto, req.user);
  }

  // ROUTE DE SUPPRESSION ACTIVÉE
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.depotService.remove(id, req.user);
  }
}
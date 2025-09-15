// backend/src/route/route.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // On utilise notre guard maison pour la cohérence

// ON RETIRE LA GARDE GLOBALE D'ICI
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  // --- NOUVELLE ROUTE PUBLIQUE ---
  @Get('public')
  findAllPublic() {
    return this.routeService.findAllPublic();
  }

  // --- LES ROUTES PRIVÉES CI-DESSOUS ONT MAINTENANT LEUR PROPRE GARDE ---

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createRouteDto: CreateRouteDto, @Req() req) {
    return this.routeService.create(createRouteDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.routeService.findAllForUser(req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto, @Req() req) {
    return this.routeService.update(id, updateRouteDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.routeService.remove(id, req.user);
  }
}
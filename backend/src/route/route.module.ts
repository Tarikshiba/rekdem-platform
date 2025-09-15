// backend/src/route/route.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/route.entity';
import { UserModule } from 'src/user/user.module';
import { DepotModule } from 'src/depot/depot.module';
import { CommandeModule } from 'src/commande/commande.module';
import { Depot } from 'src/depot/entities/depot.entity'; // On s'assure que l'entité est importée

@Module({
  imports: [
    TypeOrmModule.forFeature([Route, Depot]), // Ligne corrigée : on ajoute Depot ici
    forwardRef(() => UserModule),
    forwardRef(() => DepotModule),
    forwardRef(() => CommandeModule),
  ],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
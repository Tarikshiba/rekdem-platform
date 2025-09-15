import { Module, forwardRef } from '@nestjs/common';
import { DepotService } from './depot.service';
import { DepotController } from './depot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Depot } from './entities/depot.entity';
import { UserModule } from 'src/user/user.module';
import { RouteModule } from 'src/route/route.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Depot]),
    forwardRef(() => UserModule),
    forwardRef(() => RouteModule),
  ],
  controllers: [DepotController],
  providers: [DepotService],
  exports: [DepotService],
})
export class DepotModule {}
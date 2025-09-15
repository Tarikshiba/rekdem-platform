// backend/src/route/dto/create-route.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { TransportMode } from '../entities/route.entity';

export class CreateRouteDto {
  @IsUUID()
  @IsNotEmpty()
  originDepotId: string;

  @IsUUID()
  @IsNotEmpty()
  destinationDepotId: string;

  @IsEnum(TransportMode)
  @IsNotEmpty()
  mode: TransportMode;

  @IsNumber()
  @IsNotEmpty()
  price_per_kg: number; // Le nom est corrigé ici

  @IsNumber()
  @IsNotEmpty()
  estimated_duration_in_days: number;
}
// backend/src/commande/dto/create-commande.dto.ts

import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommandeDto {
  @IsUUID()
  @IsNotEmpty()
  routeId: string;

  // --- NOUVEAUX CHAMPS ---
  @IsString()
  @IsNotEmpty()
  external_tracking_number: string;

  @IsString()
  @IsOptional()
  purchase_site?: string;

  @IsString()
  @IsNotEmpty()
  product_description: string;

  @IsNumber()
  @IsOptional()
  declared_value?: number;
}
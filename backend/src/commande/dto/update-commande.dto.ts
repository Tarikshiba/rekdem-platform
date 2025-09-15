// backend/src/commande/dto/update-commande.dto.ts

import { IsEnum, IsNotEmpty } from 'class-validator';
// ON IMPORTE DEPUIS LE NOUVEL EMPLACEMENT
import { OrderStatus } from '../../tracking/entities/tracking.entity';

export class UpdateCommandeDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
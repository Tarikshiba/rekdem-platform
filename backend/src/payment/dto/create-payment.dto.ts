// backend/src/payment/dto/create-payment.dto.ts

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  planName: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
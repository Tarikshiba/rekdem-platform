// backend/src/payment/payment.module.ts

import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios'; // <-- 1. Importer HttpModule

@Module({
  // --- 2. Ajouter HttpModule aux imports ---
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
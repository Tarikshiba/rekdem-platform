// backend/src/payment/payment.controller.ts

import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate') // On définit une route POST claire : /payment/initiate
  @UseGuards(JwtAuthGuard) // On protège la route, seul un utilisateur connecté peut l'appeler
  initiatePayment(
    @Body() createPaymentDto: CreatePaymentDto, // On récupère les données (montant, nom du plan) du corps de la requête
    @Request() req, // On récupère l'objet de la requête pour accéder à l'utilisateur
  ) {
    const user = req.user as User; // Le guard JWT a déjà validé et attaché l'utilisateur à la requête
    
    // On appelle notre service avec les bonnes informations
    return this.paymentService.initiatePayment(createPaymentDto, user);
  }
}
// backend/src/payment/payment.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private cinetpayApiKey: string;
  private cinetpaySiteId: string;
  private cinetpayApiUrl = 'https://api-checkout.cinetpay.com/v2/payment';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // On récupère les clés et on confirme à TypeScript leur type avec "as string"
    this.cinetpayApiKey = this.configService.get<string>('CINETPAY_API_KEY') as string;
    this.cinetpaySiteId = this.configService.get<string>('CINETPAY_SITE_ID') as string;
  }

  async initiatePayment(createPaymentDto: CreatePaymentDto, user: User) {
    // On génère un identifiant de transaction unique pour chaque paiement
    const transaction_id = `REKDEM-${user.id.substring(0, 4)}-${Date.now()}`;

    const payload = {
      apikey: this.cinetpayApiKey,
      site_id: this.cinetpaySiteId,
      transaction_id: transaction_id,
      amount: createPaymentDto.amount,
      currency: 'XOF', // Franc CFA
      description: `Abonnement REKDEM - Plan ${createPaymentDto.planName}`,
      return_url: `${this.configService.get('FRONTEND_URL')}/dashboard/payment-success`,
      // notify_url: `${this.configService.get('BACKEND_URL')}/payment/webhook`, // On configurera le webhook plus tard
      
      // Informations sur le client
      customer_name: user.first_name || '',
      customer_surname: user.last_name || '',
      customer_email: user.email,
    };

    try {
      this.logger.log(`Initiating payment for transaction ID: ${transaction_id}`);
      
      const response = await firstValueFrom(
        this.httpService.post(this.cinetpayApiUrl, payload, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      
      this.logger.log(`CinetPay response: ${JSON.stringify(response.data)}`);

      // On vérifie si la réponse de CinetPay est valide
      if (response.data?.code === '201' && response.data?.data?.payment_url) {
        return { paymentUrl: response.data.data.payment_url };
      } else {
        throw new Error(response.data?.description || 'Invalid response from CinetPay');
      }
    } catch (error) {
      this.logger.error('CinetPay API Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to initiate payment.');
    }
  }
}
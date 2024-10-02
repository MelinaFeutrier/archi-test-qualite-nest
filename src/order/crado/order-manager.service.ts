import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/order/domain/entity/order.entity';
import { EmailService } from './email.service';
import { ValidationOrderService } from './validation-order.service'; // Assurez-vous que le chemin est correct
import { SmsService } from './sms.service';

@Injectable()
export class OrderManagerService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly validationOrderService: ValidationOrderService, // Injecte le service de validation
  ) {}

  async processOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new BadRequestException(`Order with ID ${orderId} not found`);
    }

    // Utilisation du service de validation pour valider la commande
    this.validationOrderService.validateOrder(order);

    // Envoi de l'email de confirmation de commande
    await this.emailService.sendOrderConfirmation(order);

    // Envoi de la confirmation par SMS
    await this.smsService.sendOrderConfirmation(order);

    // Sauvegarde de l'état de la commande
    await this.orderRepository.save(order);
  }
}

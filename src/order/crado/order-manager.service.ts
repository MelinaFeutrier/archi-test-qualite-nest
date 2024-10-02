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
    private readonly validationOrderService: ValidationOrderService, 
  ) {}

  async processOrder(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new BadRequestException(`Order with ID ${orderId} not found`);
    }

    if (!order.isValid()) {
        throw new Error('Order validation failed');
    }

    await this.emailService.sendOrderConfirmation(order);

    await this.smsService.sendOrderConfirmation(order);

    await this.orderRepository.save(order);
  }
}

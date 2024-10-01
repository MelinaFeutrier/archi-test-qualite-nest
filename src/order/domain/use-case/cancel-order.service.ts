import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Order, OrderStatus } from 'src/order/domain/entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';

export class CancelOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    orderId: string,
    cancellationReason: string, 
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    if (order.status === OrderStatus.SHIPPED) {
      throw new BadRequestException('La commande ne peut pas être annulée car elle a déjà été envoyée.');
    }

    order.status = OrderStatus.CANCELED;
    order.cancellationReason = cancellationReason;
    order.cancellationDate = new Date();

    return this.orderRepository.save(order);
  }
}

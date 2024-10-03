import { NotFoundException } from '@nestjs/common';
import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';
import { Order } from 'src/order/domain/entity/order.entity';

export class SetInvoiceAddressOrderService {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  public async execute(
    orderId: string,
    invoiceAddress: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    order.setInvoiceAddress(invoiceAddress);

    return this.orderRepository.save(order);
  }
}
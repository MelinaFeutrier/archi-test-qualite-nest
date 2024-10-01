import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';

export class SetInvoiceAddressOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    orderId: string,
    invoiceAddress: string | null,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    if (!order.shippingAddress) {
      throw new BadRequestException("L'adresse de livraison doit être renseignée avant l'adresse de facturation.");
    }

    order.invoiceAddress = invoiceAddress || order.shippingAddress;

    return this.orderRepository.save(order);
  }
}

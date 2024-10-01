import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';

@Injectable()
export class OrderPaidService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface
  ) { }

  private async getMockOrder(orderId: string): Promise<Order> {
    const mockOrder = new Order();
    mockOrder.id = orderId;
    mockOrder.customerName = 'John Doe';
    mockOrder.shippingAddress = '123 Street Name';
    mockOrder.invoiceAddress = '456 Another St';
    mockOrder.orderItems = [];
    mockOrder.price = 700;
    mockOrder.status = OrderStatus.PENDING;
    mockOrder.createdAt = new Date();
    mockOrder.paidAt = null;
    mockOrder.shippingAddressSetAt = null;

    return mockOrder;
  }


  public async markOrderAsPaid(orderId: string): Promise<string> {
   //const order = await this.orderRepository.findById(orderId);
    const order = await this.getMockOrder(orderId);

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${orderId} non trouvée`);
    }

    if (order.paidAt) {
      throw new BadRequestException('Cette commande a déjà été payée');
    }

    try {
      order.pay();
    } catch (error) {
      throw new BadRequestException(`Payment failed: ${error.message}`);
    }

    return `La commande avec l'ID ${orderId} a été marquée comme payée à la date ${order.paidAt?.toISOString()}.`;
  }
}

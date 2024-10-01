import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';

@Injectable()
export class OrderDeliveryService {
  constructor(
    @Inject('OrderRepositoryInterface') 
    private readonly orderRepository: OrderRepositoryInterface
  ) {}

  private async getMockOrder(orderId: string): Promise<Order> {
    const mockOrder = new Order();
    mockOrder.id = orderId;
    mockOrder.customerName = 'John Doe';
    mockOrder.shippingAddress = null; 
    mockOrder.invoiceAddress = '456 Another St';
    mockOrder.orderItems = [
      { id: 'item1', productName: 'Produit 1', quantity: 1, price: 20, order: mockOrder },
      { id: 'item2', productName: 'Produit 2', quantity: 2, price: 30, order: mockOrder },
      { id: 'item3', productName: 'Produit 3', quantity: 1, price: 50, order: mockOrder },
      { id: 'item4', productName: 'Produit 4', quantity: 3, price: 40, order: mockOrder },
    ];
    mockOrder.price = 100;
    mockOrder.status = OrderStatus.PENDING; 
    mockOrder.createdAt = new Date();
    mockOrder.paidAt = new Date();
    mockOrder.shippingAddressSetAt = null;

    return mockOrder;
  }

  public async addDeliveryAddressToOrder(orderId: string, shippingAddress: string): Promise<string> {
    const order = await this.getMockOrder(orderId);

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${orderId} non trouvée`);
    }

    order.addDelivery(shippingAddress);

    return `L'adresse de livraison a été ajoutée à la commande avec l'ID ${orderId}. Le nouveau prix est de ${order.price} euros.`;
  }
}

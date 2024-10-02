import {
  CreateOrderCommand,
  Order,} from '../entity/order.entity';
import OrderRepository from 'src/order/infrastructure/order.repository';

export class CreateOrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const order = new Order(createOrderCommand);

    return await this.orderRepository.save(order);
  }
}
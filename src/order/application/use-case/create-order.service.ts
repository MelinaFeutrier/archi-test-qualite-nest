import {
  CreateOrderCommand,
  Order,
} from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';

export class CreateOrderService {
  // j'injecte l'interface dans le constructeur
  // le système d'injection de Nest JS va me permettre
  // de configurer dans le orderModule quelle classe va reellement être injectée
  // (il faut bien sûr que la classe en question implémente l'interface, sinon ça n'est pas possible)
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const order = new Order(createOrderCommand);

    return await this.orderRepository.save(order);
  }
}
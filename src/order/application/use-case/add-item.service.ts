import { Injectable } from "@nestjs/common";
import { Order} from "../../domain/entity/order.entity";
import { OrderRepositoryInterface } from "src/order/domain/port/persistance/order.repository.interface";
import { ItemDetailCommand } from "src/order/domain/entity/order-item.entity";

@Injectable()
export class AddItemService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(orderId: string, itemDetail: ItemDetailCommand): Promise<void> {
    const order: Order | null = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.addItem(itemDetail);
    await this.orderRepository.save(order);
  }
}
import { Order } from 'src/order/domain/entity/order.entity';

export interface ItemDetailCommand {
  productName: string;
  price: number;
}

export interface CreateOrderCommand {
  items: ItemDetailCommand[];
  customerName: string;
  shippingAddress: string;
  invoiceAddress: string;
}

export class CreateOrderService {
  createOrder(createOrderCommand: CreateOrderCommand): string {
    const order = new Order(createOrderCommand);
 
    return 'OK. Montant de la commande: ' + order.price;
  }
}
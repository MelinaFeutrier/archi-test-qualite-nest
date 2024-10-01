import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { CreateOrderCommand, ItemDetailCommand } from '../use-case/create-order.service';

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPING_ADDRESS_SET = 'SHIPPING_ADDRESS_SET',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Order {
  static MAX_ITEMS = 5;
  static AMOUNT_MINIMUM = 5;
  static AMOUNT_MAXIMUM = 500;
  static SHIPPING_COST = 5;

  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  @Expose({ groups: ['group_orders'] })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  private status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  private paidAt: Date | null;

  constructor(createOrderCommand: CreateOrderCommand) {
    const { items, customerName, shippingAddress, invoiceAddress } = createOrderCommand;
 
    // Validation
    if (!customerName || !items || items.length === 0 || !shippingAddress || !invoiceAddress) {
      throw new BadRequestException('Missing required fields');
    }
 
    if (items.length > Order.MAX_ITEMS) {
      throw new BadRequestException('Cannot create order with more than 5 items');
    }
 
    const totalAmount = this.calculateOrderAmount(items);
 
    this.customerName = customerName;
    this.orderItems = items.map(item => {
      const orderItem = new OrderItem();
      orderItem.price = item.price;
      return orderItem;
    });
    this.shippingAddress = shippingAddress;
    this.invoiceAddress = invoiceAddress;
    this.price = totalAmount;
    this.status = OrderStatus.PENDING;
    this.createdAt = new Date();
  }
 
  private calculateOrderAmount(items: ItemDetailCommand[]): number {
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
 
    if (totalAmount < Order.AMOUNT_MINIMUM) {
      throw new BadRequestException(
        `Cannot create order with total amount less than ${Order.AMOUNT_MINIMUM}€`,
      );
    }
 
    return totalAmount;
  }

  pay(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order already paid');
    }

    if (this.price > Order.AMOUNT_MAXIMUM) {
      throw new Error('Order amount exceeds maximum allowed');
    }

    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }

  setShippingAddress(customerAddress: string): void {
    if (this.status !== OrderStatus.PENDING && this.status !== OrderStatus.SHIPPING_ADDRESS_SET) {
      throw new Error('Order not paid');
    }

    if (this.orderItems.length < Order.MAX_ITEMS) {
      throw new Error('Too few items');
    }

    this.status = OrderStatus.SHIPPING_ADDRESS_SET;
    this.shippingAddressSetAt = new Date();
    this.shippingAddress = customerAddress;
    this.price += Order.SHIPPING_COST;
  }


}

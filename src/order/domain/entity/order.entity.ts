import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  SHIPPED = 'SHIPPED',
}

@Entity()
export class Order {
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
  status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  paidAt: Date | null;

  pay(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('La commande ne peut être payée que si son état est PENDING.');
    }

    if (this.price > 500) {
      throw new Error('Le montant total de la commande ne peut pas dépasser 500 euros.');
    }

    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }

}

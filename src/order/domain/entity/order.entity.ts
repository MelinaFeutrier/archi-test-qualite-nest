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
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Order {
  static readonly MAX_ITEMS_FOR_DELIVERY = 3; 
  static readonly DELIVERY_FEE = 5; 
  static readonly AMOUNT_MINIMUM = 5; 
  static readonly AMOUNT_MAXIMUM = 500; 

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

    if (this.price > Order.AMOUNT_MAXIMUM) {
      throw new Error(`Le montant total de la commande ne peut pas dépasser ${Order.AMOUNT_MAXIMUM} euros.`);
    }

    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }

  addDelivery(shippingAddress: string): void {
    if (this.orderItems.length <= Order.MAX_ITEMS_FOR_DELIVERY) {
      throw new Error(`L’ajout de l’adresse de livraison n’est possible que si la commande contient plus de ${Order.MAX_ITEMS_FOR_DELIVERY} items.`);
    }
  
    if (this.status !== OrderStatus.PENDING && !this.shippingAddress) {
      throw new Error('La livraison est possible que si la commande est en cours ou si l’adresse de livraison a été renseignée.');
    }
  
    this.shippingAddress = shippingAddress;
  
    // Ajout des frais de livraison
    this.price += Order.DELIVERY_FEE; 
    this.shippingAddressSetAt = new Date(); 
  }
  
}

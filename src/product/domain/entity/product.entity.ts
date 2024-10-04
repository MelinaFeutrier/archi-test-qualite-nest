import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Product {
  static MAX_PRICE = 1000;
  static MIN_PRICE = 1;

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column('decimal')
  public price: number;

  @Column({ default: 0 })
  public stock: number;

  @Column({ default: true })
  public isActive?: boolean;

  @Column('text')
  public description: string;

  @CreateDateColumn()
  public createdAt: Date;

  private constructor(
    name: string,
    price: number,
    description: string,
    stock?: number,
    isActive: boolean = true
  ) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock ?? 0;
    this.isActive = isActive;
  }

  public static createProduct(
    name: string,
    price: number,
    description: string,
    stock?: number,
    isActive: boolean = true
  ): Product {
    this.validateProductDetails(name, price, description);
    return new Product(name, price, description, stock, isActive);
  }

  private static validateProductDetails(
    name: string,
    price: number,
    description: string
  ): void {
    if (!name) {
      throw new BadRequestException('Product name is required');
    }

    if (!price || price < this.MIN_PRICE || price > this.MAX_PRICE) {
      throw new BadRequestException(
        `Product price must be between ${this.MIN_PRICE} and ${this.MAX_PRICE}`
      );
    }

    if (!description) {
      throw new BadRequestException('Product description is required');
    }
  }

  public updateProductDetails(
    name: string,
    price: number,
    description: string,
    stock?: number
  ): void {
    Product.validateProductDetails(name, price, description);
    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock ?? 0;
  }

  reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0.");
    }

    if (this.stock - quantity < 0) {
      throw new BadRequestException("Insufficient stock.");
    }

    this.stock -= quantity;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  public canBeDeleted(hasOrders: boolean): boolean {
    return !hasOrders;
  }
}

import { BadRequestException } from '@nestjs/common';
import { CreateOrderCommand, Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { PromotionService } from 'src/product/application/use-case/promotion-product.service';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { EmailService } from 'src/product/infrastructure/presentation/email.service';

export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly emailService: EmailService,
    private readonly promotionService: PromotionService,
    ) {}

  async execute(createOrderCommand: CreateOrderCommand, promoCode?: string): Promise<Order> {
    const orderItems = [];

    for (const item of createOrderCommand.items) {
      const product = await this.productRepository.findById(item.id);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.isInStock() || product.stock < item.quantity) {
        await this.emailService.sendStockAlert(product);
      }

      product.reduceStock(item.quantity);
      orderItems.push({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = new Order({
      customerName: createOrderCommand.customerName,
      items: orderItems,
      shippingAddress: createOrderCommand.shippingAddress,
      invoiceAddress: createOrderCommand.invoiceAddress,
    });

    if (promoCode) {
      const promotion = await this.promotionService.findPromotionByCode(promoCode);
      if (!promotion) {
        throw new BadRequestException('Invalid promotion code.');
      }
      order.applyPromotion(promotion);
    }

    await this.orderRepository.save(order);
    return order;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './infrastructure/presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from 'src/order/application/use-case/create-order.service';
import { PayOrderService } from 'src/order/application/use-case/pay-order.service';
import { CancelOrderService } from 'src/order/application/use-case/cancel-order.service';
import { SetInvoiceAddressOrderService } from 'src/order/application/use-case/set-invoice-address-order.service';
import { SetShippingAddressOrderService } from 'src/order/application/use-case/set-shipping-address-order.service';
import OrderRepositoryTypeOrm from 'src/order/infrastructure/persistance/order.repository';
import { GenerateInvoiceService } from 'src/order/application/use-case/generate-invoice.service';
import { PdfGeneratorServiceInterface } from 'src/order/domain/port/pdf/pdf-generator.service.interface';
import { PdfGeneratorService } from 'src/order/infrastructure/pdf/pdf-generator.service';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { EmailServiceInterface } from 'src/product/infrastructure/persistance/email.repository.interface';
import { EmailService } from 'src/product/infrastructure/presentation/email.service';
import { PromotionService } from 'src/product/application/use-case/promotion-product.service';
import { ProductModule } from 'src/product/product.module'; // Import the module containing PromotionService

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    ProductModule, // Import the module to make PromotionService available
  ],
  controllers: [OrderController],
  providers: [
    OrderRepositoryTypeOrm,
    PdfGeneratorService,
    EmailService,
    {
      provide: GenerateInvoiceService,
      useFactory: (
        orderRepository: OrderRepositoryInterface,
        pdfGeneratorService: PdfGeneratorServiceInterface,
      ) => {
        return new GenerateInvoiceService(orderRepository, pdfGeneratorService);
      },
      inject: [OrderRepositoryTypeOrm, PdfGeneratorService],
    },
    {
      provide: PayOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new PayOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: CancelOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CancelOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: SetInvoiceAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new SetInvoiceAddressOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: SetShippingAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new SetShippingAddressOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: CreateOrderService,
      useFactory: (
        orderRepository: OrderRepositoryInterface,
        productRepository: ProductRepositoryInterface,
        emailService: EmailServiceInterface,
        promotionService: PromotionService, // Add the missing PromotionService
      ) => {
        return new CreateOrderService(
          orderRepository,
          productRepository,
          emailService,
          promotionService, // Pass the promotionService to the constructor
        );
      },
      inject: [OrderRepositoryTypeOrm, EmailService, PromotionService], // Inject PromotionService
    },
  ],
})
export class OrderModule {}

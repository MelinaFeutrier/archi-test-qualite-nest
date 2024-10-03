import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './infrastructure/presentation/order.controller';
import { Order, PdfGeneratorInterface } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';
import { CreateOrderService } from './application/use-case/create-order.service';
import { PayOrderService } from './application/use-case/pay-order.service';
import { CancelOrderService } from './application/use-case/cancel-order.service';
import { SetInvoiceAddressOrderService } from './application/use-case/set-invoice-address-order.service';
import { SetShippingAddressOrderService } from './application/use-case/set-shipping-address-order.service';
import { GenerateOrderPdfUseCase } from './application/use-case/generate-order-pdf';
import OrderRepositoryTypeOrm from './infrastructure/bdd/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],

  providers: [
    // j'enregistre mon repository en tant que service

    // j'enregistre le service directement (pas besoin de faire de useFactory)
    // pour celui là car il injecte directement le OrderRepositoryTypeOrm)
  
    // pour pouvoir gérer l'inversion de dépendance
    // du service CreateOrderService
    // j'utilise le système de useFactory de nest
    {
      // quand j'enregistre la classe CreateOrderService
      provide: CreateOrderService,
      // je demande à Nest Js de créer une instance de cette classe
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CreateOrderService(orderRepository);
      },
      // en lui injectant une instance de OrderRepositoryTypeOrm
      // à la place de l'interface qui est utilisée dans le constructeur de CreateOrderService
      inject: [OrderRepositoryTypeOrm],
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
      provide: GenerateOrderPdfUseCase,
      useFactory: (orderRepository: OrderRepositoryInterface, pdfGenerator: PdfGeneratorInterface) => {
        return new GenerateOrderPdfUseCase(orderRepository, pdfGenerator);
      },
      inject: [OrderRepositoryTypeOrm, 'PdfGeneratorInterface'],
    },
    
  ],
  exports: [GenerateOrderPdfUseCase],
 
})
export class OrderModule {}


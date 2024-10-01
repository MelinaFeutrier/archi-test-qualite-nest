import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from 'src/order/domain/use-case/create-order.service';
import { PayOrderService } from 'src/order/domain/use-case/order-pay.service';
import { SetShippingAddressOrderService } from 'src/order/domain/use-case/set-shipping-address-order.service';
import { SetInvoiceAddressOrderService } from 'src/order/domain/use-case/invoice-adress.service';
import { CancelOrderService } from 'src/order/domain/use-case/cancel-order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [CreateOrderService, PayOrderService, SetShippingAddressOrderService, SetInvoiceAddressOrderService, CancelOrderService],
})
export class OrderModule {}
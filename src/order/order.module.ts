import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from './domain/use-case/create-order.service';
import { PayOrderService } from './domain/use-case/pay-order.service';
import { OrderManagerService } from './crado/order-manager.service';
import { SmsService } from './crado/sms.service';
import { EmailService } from './crado/email.service';


@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [CreateOrderService, 
    PayOrderService, 
    OrderManagerService, 
    SmsService, 
    EmailService],
})
export class OrderModule {}
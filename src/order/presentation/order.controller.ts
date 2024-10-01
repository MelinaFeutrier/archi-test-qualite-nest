import { Controller, Get, Post, Body, Patch, Param,  } from '@nestjs/common';
import CreateOrderService from '../domain/use-case/create-order.service';
import { OrderPaidService } from '../domain/use-case/order-pay.service';
import { OrderDeliveryService } from '../domain/use-case/delivery-order.service';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly orderPaidService: OrderPaidService,
    private readonly orderDeliveryService: OrderDeliveryService,
  ) {}
  

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post('/create')
  async createOrder(
    @Body() body: any
  ): Promise<string> {
    return this.createOrderService.createOrder(body);
  }

  @Post('/:id/pay')
  async payOrder(@Param('id') id: string): Promise<string> {
    return this.orderPaidService.markOrderAsPaid(id);
  }

  @Post('/:id/delivery') 
  async addDeliveryAddress(
    @Param('id') id: string,
    @Body('shippingAddress') shippingAddress: string, 
  ): Promise<string> {
    return this.orderDeliveryService.addDeliveryAddressToOrder(id, shippingAddress);
  }

  
}

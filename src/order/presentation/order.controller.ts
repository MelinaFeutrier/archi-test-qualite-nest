import { Controller, Get, Post, Body, Patch, Param,  } from '@nestjs/common';
import CreateOrderService from '../domain/use-case/create-order.service';
import { OrderPaidService } from '../domain/use-case/order-pay.service';


@Controller('/orders')
export default class OrderController {
  constructor(private readonly createOrderService: CreateOrderService, private readonly orderPaidService:OrderPaidService ) {}
  

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

  @Patch('/:id/pay')
  async payOrder(@Param('id') id: string): Promise<string> {
    return this.orderPaidService.markOrderAsPaid(id);
  }
  
}

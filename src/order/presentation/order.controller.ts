import { Controller, Get, Post, Body,  } from '@nestjs/common';
import CreateOrderService from '../domain/use-case/create-order.service';

@Controller('/orders')
export default class OrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post('/create')
  async createOrder(@Body() body: any): Promise<string> {
    return this.createOrderService.execute(body);
  }
  
}

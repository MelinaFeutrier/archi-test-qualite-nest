import { Body, Controller, Param, Post } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import {
  CreateOrderCommand,
  CreateOrderService,
} from 'src/order/domain/use-case/create-order.service';
import { PayOrderService } from 'src/order/domain/use-case/order-pay.service';
import { SetInvoiceAddressOrderService } from 'src/order/domain/use-case/invoice-adress.service';
import { CancelOrderService } from 'src/order/domain/use-case/cancel-order.service';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly payOrderService: PayOrderService,
    private readonly setInvoiceAddressOrderService: SetInvoiceAddressOrderService,
    private readonly cancelOrderService: CancelOrderService,
  ) {}

  // Créer une commande
  @Post()
  async createOrder(
    @Body() createOrderCommand: CreateOrderCommand,
  ): Promise<string> {
    return this.createOrderService.createOrder(createOrderCommand);
  }

  // Payer une commande
  @Post('/:id/pay')
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.payOrder(id);
  }

  @Post('/:id/invoice-address')
  async setInvoiceAddress(
    @Param('id') id: string,
    @Body('invoiceAddress') invoiceAddress: string | null,
  ): Promise<Order> {
    return await this.setInvoiceAddressOrderService.execute(id, invoiceAddress);
  }

  @Post('/:id/cancel')
  async cancelOrder(
    @Param('id') id: string,
    @Body('reason') reason: string, 
  ): Promise<Order> {
    return await this.cancelOrderService.execute(id, reason);
  }
}

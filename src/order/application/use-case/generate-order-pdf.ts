// src/order/application/use-case/generate-order-pdf.usecase.ts
import { Injectable } from '@nestjs/common';
import { OrderRepositoryInterface } from '../../domain/port/order.repository.interface';
import { PdfGeneratorInterface } from '../../domain/port/pdf-generator.interface';

@Injectable()
export class GenerateOrderPdfUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly pdfGenerator: PdfGeneratorInterface,
  ) {}

  async execute(orderId: string): Promise<Buffer> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const invoiceData = order.getInvoiceData();

    const pdfBuffer = await this.pdfGenerator.generateOrderPdf(invoiceData.orderId, invoiceData.items);
    return pdfBuffer;
  }
}

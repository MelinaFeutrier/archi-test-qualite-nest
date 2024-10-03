import { Injectable } from '@nestjs/common';
import { PdfGeneratorInterface } from '../../domain/port/pdf-generator.interface';
import { OrderItem } from '../../domain/entity/order-item.entity';
import IronPdf from '@ironsoftware/ironpdf';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class IronPDFGenerator implements PdfGeneratorInterface {
  async generateOrderPdf(orderId: string, items: OrderItem[]): Promise<Buffer> {
    const content = `
      <h1>Order ID: ${orderId}</h1>
      <h2>Items:</h2>
      <ul>
        ${items.map((item) => `<li>${item.productName} - Quantity: ${item.quantity}</li>`).join('')}
      </ul>
    `;

    const pdf = await IronPdf.PdfDocument.fromHtml(content);

    const tempFilePath = path.join(__dirname, 'tempOrder.pdf');
    await pdf.saveAs(tempFilePath);

    const pdfBuffer = fs.readFileSync(tempFilePath);

    fs.unlinkSync(tempFilePath);

    return pdfBuffer;
  }
}

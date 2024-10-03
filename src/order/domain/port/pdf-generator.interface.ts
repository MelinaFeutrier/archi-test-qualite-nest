export interface PdfGeneratorInterface {
    generateOrderPdf(orderId: string, items: any[]): Promise<Buffer>;
  }
  
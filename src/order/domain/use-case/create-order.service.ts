import { BadRequestException } from '@nestjs/common';

export default class CreateOrderService {

  private static readonly MIN_ORDER_AMOUNT = 10;
  private static readonly MAX_ORDER_ITEMS = 5;

  public async createOrder(body: any): Promise<string> {
    this.validateOrder(body);
    return 'Commande créée avec succès';
  }

  private validateOrder(body: any): void {
    const { customerName, shippingAddress, invoiceAddress, orderItems } = body;

    this.validateCustomerAndOrder(customerName, shippingAddress, invoiceAddress, orderItems);

    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + item.price, 0);
    if (totalAmount < CreateOrderService.MIN_ORDER_AMOUNT) {
      throw new BadRequestException('Le montant total de la commande doit être supérieur à 10€.');
    }
  }

  private validateCustomerAndOrder(customerName: string, shippingAddress: string, invoiceAddress: string, orderItems: any[]): void {
    if (!customerName || !shippingAddress || !invoiceAddress) {
      throw new BadRequestException('Le nom du client, l\'adresse de livraison et l\'adresse de facturation sont requis.');
    }

    if (!orderItems || orderItems.length === 0 || orderItems.length > CreateOrderService.MAX_ORDER_ITEMS) {
      throw new BadRequestException('Au moins un article est requis et un maximum de 5 articles est autorisé.');
    }
  }
}

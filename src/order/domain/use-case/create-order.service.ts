import { BadRequestException } from '@nestjs/common';

export default class CreateOrderService {
  public async createOrder(body: any): Promise<string> {
    this.validateOrder(body);
    return 'Commande créée avec succès';
  }

  private validateOrder(body: any): void {
    const { customerName, shippingAddress, invoiceAddress, orderItems } = body;

    if (!customerName || !shippingAddress || !invoiceAddress) {
      throw new BadRequestException('Le nom du client, l\'adresse de livraison et l\'adresse de facturation sont requis.');
    }

    if (!orderItems || orderItems.length === 0 || orderItems.length > 5) {
      throw new BadRequestException('Au moins un article est requis et un maximum de 5 articles est autorisé.');
    }

    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + item.price, 0);
    if (totalAmount < 10) {
      throw new BadRequestException('Le montant total de la commande doit être supérieur à 10€.');
    }
  }
}

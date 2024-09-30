import { BadRequestException } from '@nestjs/common';

export default class CreateOrderService {
  public async execute(body: any): Promise<string> {
    this.validateOrder(body);
    return 'Commande créée avec succès';
  }

  private validateOrder(body: any): void {
    const { customerName, shippingAddress, invoiceAddress, orderItems } = body;

    if (!customerName) {
      throw new BadRequestException('Le nom du client est requis');
    }

    if (!shippingAddress || !invoiceAddress) {
      throw new BadRequestException('Les adresses de livraison et de facturation sont requises');
    }

    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Au moins un article est requis');
    }

    if (orderItems.length > 5) {
      throw new BadRequestException('Impossible de créer une commande avec plus de 5 articles');
    }

    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + item.price, 0);

    if (totalAmount < 10) {
      throw new BadRequestException('Le montant total de la commande doit être supérieur à 10€');
    }
  }
}

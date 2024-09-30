import { BadRequestException } from '@nestjs/common';

export default class CreateOrderService {
  // Méthode publique unique pour traiter la création d'une commande
  public async execute(body: any): Promise<string> {
    this.validateOrder(body);
    // On pourrait imaginer ici un appel à un repository pour sauvegarder la commande
    return 'Commande créée avec succès';
  }

  // Méthodes privées pour encapsuler la logique métier
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

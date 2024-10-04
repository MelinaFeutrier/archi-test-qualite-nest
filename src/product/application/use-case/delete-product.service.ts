import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';

export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(productId: string, hasOrders: boolean): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.canBeDeleted(hasOrders)) {
      throw new Error('Cannot delete product linked to existing orders');
    }

    await this.productRepository.delete(productId);
  }
}

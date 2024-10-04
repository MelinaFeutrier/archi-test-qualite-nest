import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

export class UpdateProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(id: string, name: string, price: number, description: string, stock: number): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    product.updateProductDetails(name, price, description, stock);
    await this.productRepository.update(product);
    return product;
  }
}

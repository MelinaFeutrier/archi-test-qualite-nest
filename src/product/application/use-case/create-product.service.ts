import { Product } from '../../domain/entity/product.entity';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';

export class CreateProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(
    name: string,
    price: number,
    description: string,
    stock?: number,
    isActive: boolean = true
  ): Promise<Product> {
    const product = Product.createProduct(name, price, description, stock, isActive);
    
    await this.productRepository.create(product);
    
    return product;
  }
}

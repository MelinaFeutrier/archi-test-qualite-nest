import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

export class ListProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(isActive?: boolean): Promise<Product[]> {
    return await this.productRepository.findAll({ isActive });
  }
}

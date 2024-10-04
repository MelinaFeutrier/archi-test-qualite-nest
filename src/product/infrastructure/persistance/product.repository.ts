import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';
 
export class ProductRepositoryTypeOrm 
  implements ProductRepositoryInterface {
  private products: Product[] = [];
 
  async create(product: Product): Promise<void> {
    this.products.push(product);
  }
 
  async update(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }
 
  async delete(productId: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== productId);
  }
 
  async findById(productId: string): Promise<Product | null> {
    return this.products.find((p) => p.id === productId) || null;
  }
 
  async findAll(): Promise<Product[]> {
    return this.products;
  }
}
 
 
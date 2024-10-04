import { ListProductService } from './list-product.service';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

// Fake implementation of ProductRepositoryInterface
class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {}

  async delete(productId: string): Promise<void> {}

  async findById(productId: string): Promise<Product | null> {
    return this.products.find((product) => product.id === productId) || null;
  }

  async findAll(filter?: { isActive?: boolean }): Promise<Product[]> {
    if (filter?.isActive !== undefined) {
      return this.products.filter((product) => product.isActive === filter.isActive);
    }
    return this.products;
  }
}

const productRepositoryFake = new ProductRepositoryFake() as ProductRepositoryInterface;

describe('ListProductService', () => {
  it('should return all products if no filter is provided', async () => {
    const listProductService = new ListProductService(productRepositoryFake);

    // Create mock products
    const product1 = Product.createProduct('Product 1', 100, 'Description 1', 10, true);
    const product2 = Product.createProduct('Product 2', 150, 'Description 2', 5, false);
    await productRepositoryFake.create(product1);
    await productRepositoryFake.create(product2);

    const products = await listProductService.execute();

    expect(products.length).toBe(2);
    expect(products).toContain(product1);
    expect(products).toContain(product2);
  });

  it('should return only active products if isActive filter is true', async () => {
    const listProductService = new ListProductService(productRepositoryFake);

    const products = await listProductService.execute(true);

    expect(products.length).toBe(1);
    expect(products[0].isActive).toBe(true);
  });

  it('should return only inactive products if isActive filter is false', async () => {
    const listProductService = new ListProductService(productRepositoryFake);

    const products = await listProductService.execute(false);

    expect(products.length).toBe(1);
    expect(products[0].isActive).toBe(false);
  });
});

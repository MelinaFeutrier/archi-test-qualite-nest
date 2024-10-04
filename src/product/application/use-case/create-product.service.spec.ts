import { CreateProductService } from './create-product.service';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

class ProductRepositoryFake implements ProductRepositoryInterface {
  async create(product: Product): Promise<void> {
    // Simulate saving the product, no actual implementation needed for the test
    return;
  }

  async update(product: Product): Promise<void> {}
  async delete(productId: string): Promise<void> {}
  async findById(productId: string): Promise<Product | null> {
    return null;
  }
  async findAll(): Promise<Product[]> {
    return [];
  }
}

const productRepositoryFake = new ProductRepositoryFake() as ProductRepositoryInterface;

describe('CreateProductService', () => {
  it('should throw an error if the product price is not within the valid range', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);

    await expect(
      createProductService.execute('Invalid Product', 2000, 'An expensive product')
    ).rejects.toThrow('Product price must be between 1 and 1000');
  });

  it('should throw an error if the product name is empty', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);

    await expect(
      createProductService.execute('', 100, 'A product with no name')
    ).rejects.toThrow('Product name is required');
  });

  it('should successfully create a product when valid data is provided', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);

    const product = await createProductService.execute(
      'Valid Product',
      500,
      'A valid product description',
      10,
      true
    );

    expect(product.name).toBe('Valid Product');
    expect(product.price).toBe(500);
    expect(product.description).toBe('A valid product description');
    expect(product.stock).toBe(10);
    expect(product.isActive).toBe(true);
  });
});

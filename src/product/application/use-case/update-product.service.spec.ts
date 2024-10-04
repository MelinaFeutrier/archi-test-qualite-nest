import { UpdateProductService } from './update-product.service';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

// Mock implementation of ProductRepositoryInterface
class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    }
  }

  async delete(productId: string): Promise<void> {
    this.products = this.products.filter((product) => product.id !== productId);
  }

  async findById(productId: string): Promise<Product | null> {
    return this.products.find((product) => product.id === productId) || null;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }
}

const productRepositoryFake = new ProductRepositoryFake() as ProductRepositoryInterface;

describe('UpdateProductService', () => {
  it('should throw an error if the product does not exist', async () => {
    const updateProductService = new UpdateProductService(productRepositoryFake);

    await expect(
      updateProductService.execute('non-existent-id', 'Updated Product', 200, 'Updated Description', 50)
    ).rejects.toThrow('Product not found');
  });

  it('should successfully update an existing product', async () => {
    const updateProductService = new UpdateProductService(productRepositoryFake);

    // Create a mock product to be updated
    const mockProduct = Product.createProduct('Original Product', 100, 'Original Description', 20);
    await productRepositoryFake.create(mockProduct);

    // Act: Update the product
    const updatedProduct = await updateProductService.execute(
      mockProduct.id,
      'Updated Product',
      200,
      'Updated Description',
      50
    );

    // Assert: Check if the product was updated correctly
    expect(updatedProduct.name).toBe('Updated Product');
    expect(updatedProduct.price).toBe(200);
    expect(updatedProduct.description).toBe('Updated Description');
    expect(updatedProduct.stock).toBe(50);

    // Check if the product in the repository was also updated
    const storedProduct = await productRepositoryFake.findById(mockProduct.id);
    expect(storedProduct).toBeTruthy();
    expect(storedProduct?.name).toBe('Updated Product');
    expect(storedProduct?.price).toBe(200);
    expect(storedProduct?.description).toBe('Updated Description');
    expect(storedProduct?.stock).toBe(50);
  });
});

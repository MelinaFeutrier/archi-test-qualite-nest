import { DeleteProductService } from './delete-product.service';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product.repository.interface';
import { Product } from '../../domain/entity/product.entity';

// Mock implementation of the ProductRepositoryInterface
class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {}

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

describe('DeleteProductService', () => {
  it('should throw an error if the product does not exist', async () => {
    const deleteProductService = new DeleteProductService(productRepositoryFake);

    await expect(deleteProductService.execute('non-existent-id', false)).rejects.toThrow('Product not found');
  });

  it('should throw an error if the product is linked to existing orders', async () => {
    const deleteProductService = new DeleteProductService(productRepositoryFake);

    const mockProduct = Product.createProduct('Test Product', 100, 'Test Description');
    await productRepositoryFake.create(mockProduct);

    await expect(deleteProductService.execute(mockProduct.id, true)).rejects.toThrow('Cannot delete product linked to existing orders');
  });

  it('should delete the product successfully if it is not linked to existing orders', async () => {
    const deleteProductService = new DeleteProductService(productRepositoryFake);

    const mockProduct = Product.createProduct('Test Product', 100, 'Test Description');
    await productRepositoryFake.create(mockProduct);

    await deleteProductService.execute(mockProduct.id, false);

    const deletedProduct = await productRepositoryFake.findById(mockProduct.id);
    expect(deletedProduct).toBeNull();
  });
});

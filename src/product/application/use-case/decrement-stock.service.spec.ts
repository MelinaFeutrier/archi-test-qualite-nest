import { Product } from "../../domain/entity/product.entity";
import { DecrementStockService } from "./decrement-stock.service";
import { ProductRepositoryTypeOrm } from "../../infrastructure/persistance/product.repository";

class MockEmailService {
  async sendStockAlert(product: Product): Promise<void> {
    console.log(`Stock alert sent for product: ${product.name}`);
  }
}

describe("DecrementStockService", () => {
  let decrementStockService: DecrementStockService;
  let productRepositoryMock: ProductRepositoryTypeOrm;
  let mockEmailService: MockEmailService;
  let mockProduct: Product;

  beforeEach(async () => {
    mockEmailService = new MockEmailService();

    mockProduct = Product.createProduct(
      "Test Product",    
      100,               
      "Test Description", 
      10                
    );

    productRepositoryMock = new ProductRepositoryTypeOrm();
    await productRepositoryMock.create(mockProduct);  

    decrementStockService = new DecrementStockService(productRepositoryMock, mockEmailService);
  });

  test("should reduce stock successfully", async () => {
    await decrementStockService.execute(mockProduct.id, 5);

    expect(mockProduct.stock).toBe(5); 
  });

  test("should send stock alert when stock reaches zero", async () => {
    await decrementStockService.execute(mockProduct.id, 10); 
    expect(mockProduct.stock).toBe(0); 
  });

  test("should throw an error when product is not found", async () => {
    await expect(decrementStockService.execute("invalid-id", 1)).rejects.toThrow("Article non trouvé");
  });

  test("should throw an error when stock is insufficient", async () => {
    await decrementStockService.execute(mockProduct.id, 10); 

    await expect(decrementStockService.execute(mockProduct.id, 1)).rejects.toThrow("Insufficient stock.");
  });

  test("should throw an error when quantity is invalid", async () => {
    await expect(decrementStockService.execute(mockProduct.id, -1)).rejects.toThrow("Quantity must be greater than 0.");
  });
});

import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "../../domain/entity/product.entity"; 
import { ProductRepositoryInterface } from "src/product/domain/port/persistance/product.repository.interface";
import { EmailService } from "src/product/infrastructure/presentation/email.service";

@Injectable()
export class UpdateStockService {
  constructor(
    private readonly productRepo: ProductRepositoryInterface,
    private readonly emailService: EmailService,
  ) {}

  async reduceStock(productId: string, quantity: number): Promise<void> {
    const product: Product | null = await this.productRepo.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock to reduce');
    }

    product.stock -= quantity;
    
    await this.productRepo.update(product);

    if (product.stock <= 0) {
      await this.emailService.sendStockAlert({
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
      });
    }
  }
}

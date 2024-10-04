import { Injectable } from "@nestjs/common";
import { Product } from "../../domain/entity/product.entity"; 
import { EmailService } from "../../infrastructure/presentation/email.service";
import { ProductRepositoryInterface } from "src/product/domain/port/persistance/product.repository.interface";

@Injectable()
export class DecrementStockService {
  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly emailService: EmailService,
  ) {}

  async execute(productId: string, quantity: number): Promise<void> {
    const product: Product | null = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Article non trouvé');
    }

    product.reduceStock(quantity);
    await this.productRepository.update(product);

    if (product.stock === 0) {
      await this.emailService.sendStockAlert(product);
    }
  }
}
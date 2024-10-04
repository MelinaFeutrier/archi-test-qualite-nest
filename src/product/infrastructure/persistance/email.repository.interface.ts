import { Product } from "src/product/domain/entity/product.entity";

export interface EmailServiceInterface {
    sendStockAlert(product: Product): Promise<void>;
  }
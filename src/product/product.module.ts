import { Module } from '@nestjs/common';
import { CreateProductService } from './application/use-case/create-product.service';
import { UpdateProductService } from './application/use-case/update-product.service';
import { DeleteProductService } from './application/use-case/delete-product.service';
import { ListProductService } from './application/use-case/list-product.service';
import { ProductRepositoryTypeOrm } from './infrastructure/persistance/product.repository';
import { UpdateStockService } from './application/use-case/update-stock.service'; 
import { EmailService } from './infrastructure/presentation/email.service'; 

@Module({
  providers: [
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepositoryTypeOrm, 
    },  
    {
      provide: CreateProductService,
      useFactory: (productRepository: ProductRepositoryTypeOrm) => {
        return new CreateProductService(productRepository);
      },
      inject: ['ProductRepositoryInterface'],
    },
    {
      provide: UpdateProductService,
      useFactory: (productRepository: ProductRepositoryTypeOrm) => {
        return new UpdateProductService(productRepository);
      },
      inject: ['ProductRepositoryInterface'],
    },
    {
      provide: DeleteProductService,
      useFactory: (productRepository: ProductRepositoryTypeOrm) => {
        return new DeleteProductService(productRepository);
      },
      inject: ['ProductRepositoryInterface'],
    },
    {
      provide: ListProductService,
      useFactory: (productRepository: ProductRepositoryTypeOrm) => {
        return new ListProductService(productRepository);
      },
      inject: ['ProductRepositoryInterface'],
    },
    {
      provide: UpdateStockService,
      useFactory: (
        productRepository: ProductRepositoryTypeOrm,
        emailService: EmailService,
      ) => {
        return new UpdateStockService(productRepository, emailService);
      },
      inject: ['ProductRepositoryInterface', EmailService],
    },
    EmailService, // Register EmailService as a provider
  ],
  exports: [
    CreateProductService,
    UpdateProductService,
    DeleteProductService,
    ListProductService,
    UpdateStockService, 
  ],
})
export class ProductModule {}

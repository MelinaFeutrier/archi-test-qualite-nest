import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateProductService } from './application/use-case/update-product.service';
import { DeleteProductService } from './application/use-case/delete-product.service';
import { ListProductService } from './application/use-case/list-product.service';
import { ProductRepositoryTypeOrm } from './infrastructure/persistance/product.repository';
import { EmailService } from './infrastructure/presentation/email.service'; 
import { DecrementStockService } from './application/use-case/decrement-stock.service';
import { CreateProductService } from './application/use-case/create-product.service';
import { PromotionRepository } from './infrastructure/persistance/promotion.repository';
import { PromotionService } from './application/use-case/promotion-product.service';
import { Promotion } from './domain/entity/promotion.entity';
import { PromotionRepositoryInterface } from './domain/port/persistance/promotion.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])], 
  providers: [
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepositoryTypeOrm, 
    },
    {
      provide: 'PromotionRepositoryInterface',
      useClass: PromotionRepository,
    },
    {
      provide: PromotionService,
      useFactory: (promotionRepository: PromotionRepositoryInterface) => {
        return new PromotionService(promotionRepository);//il y a une erreur ici mais je compte le corriger
      },
      inject: ['PromotionRepositoryInterface'], 
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
      provide: DecrementStockService,
      useFactory: (
        productRepository: ProductRepositoryTypeOrm,
        emailService: EmailService,
      ) => {
        return new DecrementStockService(productRepository, emailService);
      },
      inject: ['ProductRepositoryInterface', EmailService], 
    },
    EmailService,
  ],
  exports: [
    CreateProductService,
    UpdateProductService,
    DeleteProductService,
    ListProductService,
    DecrementStockService,
    PromotionService, 
    PromotionRepository
  ],
})
export class ProductModule {}

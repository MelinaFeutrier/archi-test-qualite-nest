import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PromotionRepositoryInterface } from 'src/product/domain/port/persistance/promotion.repository.interface';
import { Promotion } from 'src/product/domain/entity/promotion.entity';

@Injectable()
export class PromotionRepository implements PromotionRepositoryInterface {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async create(promotion: Promotion): Promise<Promotion> {
    return this.promotionRepository.save(promotion);
  }

  async findByCode(code: string): Promise<Promotion | null> {
    return this.promotionRepository.findOne({ where: { code } });
  }

  async findAll(): Promise<Promotion[]> {
    return this.promotionRepository.find();
  }
}

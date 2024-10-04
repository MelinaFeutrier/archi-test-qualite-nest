import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/product/domain/entity/promotion.entity';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async createPromotion(name: string, code: string, amount?: number): Promise<Promotion> {
    const promotion = new Promotion(name, code, amount);
    return this.promotionRepository.save(promotion);
  }

  async findPromotionByCode(code: string): Promise<Promotion | undefined> {
    return this.promotionRepository.findOne({ where: { code } });
  }
}

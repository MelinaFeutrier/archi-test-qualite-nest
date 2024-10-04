import { Promotion } from "../../entity/promotion.entity";

export interface PromotionRepositoryInterface {
  create(promotion: Promotion): Promise<Promotion>;
  findByCode(code: string): Promise<Promotion | null>;
  findAll(): Promise<Promotion[]>;
}

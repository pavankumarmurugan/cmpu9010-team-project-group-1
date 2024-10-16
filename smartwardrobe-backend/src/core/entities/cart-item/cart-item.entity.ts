import { BaseEntity } from '../base/base.entity';

export class CartItemEntity extends BaseEntity {
  readonly id?: number;
  readonly sessionId: number;
  readonly productId: number;
  readonly quantity: number;
}

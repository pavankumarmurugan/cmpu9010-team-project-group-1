import { BaseEntity } from '../base/base.entity';

export class CartItemEntity extends BaseEntity {
  readonly id?: number;
  readonly cartId: number;
  readonly productId: number;
  readonly quantity: number;
}

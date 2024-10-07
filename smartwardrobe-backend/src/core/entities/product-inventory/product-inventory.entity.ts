import { BaseEntity } from '../base/base.entity';
import { ProductEntity } from '../product/product.entity';

export class ProductInventoryEntity extends BaseEntity {
  readonly id?: number;
  readonly quantity: number;
  readonly product?: ProductEntity;
}

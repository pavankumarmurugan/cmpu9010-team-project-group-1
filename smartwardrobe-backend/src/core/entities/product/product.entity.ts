import { BaseEntity } from '../base/base.entity';
import { ProductInventoryEntity } from '../product-inventory/product-inventory.entity';

export class ProductEntity extends BaseEntity {
  readonly id?: number;
  readonly name: string;
  readonly desc: string;
  readonly SKU: string;
  readonly categoryId: number;
  readonly inventory?: ProductInventoryEntity;
  readonly discountId: number;
  readonly price: number;
}

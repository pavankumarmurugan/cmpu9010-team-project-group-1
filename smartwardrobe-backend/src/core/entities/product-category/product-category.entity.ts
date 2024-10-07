import { BaseEntity } from '../base/base.entity';

export class ProductCategoryEntity extends BaseEntity {
  readonly id?: number;
  readonly name: string;
  readonly desc: string;
}

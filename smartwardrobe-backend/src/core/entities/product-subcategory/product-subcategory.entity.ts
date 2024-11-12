import { BaseEntity } from '../base/base.entity';

export class ProductSubcategoryEntity extends BaseEntity {
  id?: number;
  categoryId?: number;
  name?: string;
  description?: string;
}

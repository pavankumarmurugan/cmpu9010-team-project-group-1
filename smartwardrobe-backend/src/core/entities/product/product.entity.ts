import { BaseEntity } from '../base/base.entity';

export class ProductEntity extends BaseEntity {
  readonly id: number;
  readonly imageName?: string;
  readonly color?: string;
  readonly type?: string;
  readonly style?: string;
  readonly material?: string;
  readonly category?: string;
  readonly occasion?: string;
  readonly neckline?: string;
  readonly fit?: string;
  readonly description?: string;
  readonly imageUrl?: string;
  readonly price?: number;
}

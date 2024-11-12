import { BaseEntity } from '../base/base.entity';

export class ProductEntity extends BaseEntity {
  readonly id?: number;
  readonly imageName?: string;
  readonly name?: string;
  readonly type?: string;
  readonly pattern?: string;
  readonly color?: string;
  readonly colorShade?: string;
  readonly material?: string;
  readonly occasion?: string;
  readonly applicableSeason?: string;
  readonly description?: string;
  readonly price?: number;
  readonly imageUrl?: string;
  readonly trail?: boolean;
  readonly category?: string;
}

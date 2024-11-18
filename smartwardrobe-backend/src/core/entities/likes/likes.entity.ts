import { BaseEntity } from '../base/base.entity';

export class LikesEntity extends BaseEntity {
  readonly id?: number;
  readonly userId?: number;
  readonly productId?: number;
  readonly productSize: string;
}

import { BaseEntity } from '../base/base.entity';

export class UserLikedModelsEntity extends BaseEntity {
  id?: number;
  userId?: number;
  modelImageName?: string;
  modelImageUrl?: string;
}

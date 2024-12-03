import { UserModel } from 'src/infrastructure/frameworks/data-services/model/user.model';
import { BaseEntity } from '../base/base.entity';

export class SearchHistoryEntity extends BaseEntity {
  id?: number;
  userId?: number;
  searchQuery?: string;
  user?: UserModel;
}

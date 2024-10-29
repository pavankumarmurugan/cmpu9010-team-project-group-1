import { BaseEntity } from '../base/base.entity';

export class FriendsEntity extends BaseEntity {
  readonly friendId?: number;
  readonly user1Id?: number;
  readonly user2Id?: number;
}

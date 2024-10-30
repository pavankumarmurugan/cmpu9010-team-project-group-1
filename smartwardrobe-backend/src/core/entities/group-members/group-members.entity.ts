import { BaseEntity } from '../base/base.entity';

export class GroupMembersEntity extends BaseEntity {
  readonly membershipId?: number;
  readonly groupId?: number;
  readonly userId?: number;
  readonly joinedAt?: Date;
}

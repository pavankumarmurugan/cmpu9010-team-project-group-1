import { BaseEntity } from '../base/base.entity';

export class GroupEntity extends BaseEntity {
  readonly groupId?: number;
  readonly groupName?: string;
  readonly createdBy?: number;
}

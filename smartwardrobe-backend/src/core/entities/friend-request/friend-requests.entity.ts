import { BaseEntity } from '../base/base.entity';

export class FriendRequestsEntity extends BaseEntity {
  readonly requestId?: number;
  readonly senderId?: number;
  readonly receiverId?: number;
  readonly status?: string;
}

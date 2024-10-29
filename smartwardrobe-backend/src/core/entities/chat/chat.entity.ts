import { BaseEntity } from '../base/base.entity';

export class ChatEntity extends BaseEntity {
  readonly id?: number;
  readonly senderId?: number;
  readonly receiverId?: number;
  readonly message?: string;
  readonly messageType?: string;
  readonly groupId?: number;
}

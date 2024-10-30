import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('friend_requests')
export class FriendsRequestsModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'request_id' })
  requestId: number;

  @Column({ type: 'int', nullable: false, name: 'sender_id' })
  senderId: number;

  @Column({ type: 'int', nullable: false, name: 'receiver_id' })
  receiverId: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: string;
}

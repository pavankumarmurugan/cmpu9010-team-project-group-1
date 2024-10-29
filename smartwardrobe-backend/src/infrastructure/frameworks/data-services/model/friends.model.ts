import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('friends')
export class FriendsModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'friend_id' })
  friendId: number;

  @Column({ type: 'int', nullable: false, name: 'user1_id' })
  user1Id: number;

  @Column({ type: 'int', nullable: false, name: 'user2_id' })
  user2Id: number;
}

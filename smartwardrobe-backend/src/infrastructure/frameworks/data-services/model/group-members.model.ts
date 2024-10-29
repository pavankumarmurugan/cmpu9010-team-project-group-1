import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('group_members')
export class GroupMembersModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'membership_id' })
  membershipId: number;

  @Column({ type: 'int', nullable: false, name: 'group_id' })
  groupId: number;

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'joined_at',
  })
  joinedAt: Date;
}

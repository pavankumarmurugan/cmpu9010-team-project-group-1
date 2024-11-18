import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseModel } from './base.model';
import { GroupModel } from './group.model';

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

  @ManyToOne(() => GroupModel, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group?: GroupModel;
}

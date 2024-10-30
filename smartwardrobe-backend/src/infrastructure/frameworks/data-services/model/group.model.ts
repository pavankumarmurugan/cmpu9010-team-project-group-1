import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserModel } from './user.model';
import { BaseModel } from './base.model';

@Entity({ name: 'group' })
export class GroupModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'group_id' })
  groupId?: number;

  @Column({ type: 'varchar', length: 255, name: 'group_name' })
  groupName?: string;

  @Column({ type: 'int', name: 'created_by' })
  createdBy?: number;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'created_by' })
  creator?: UserModel;
}

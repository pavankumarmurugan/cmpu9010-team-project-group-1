import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('group')
export class GroupModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'group_id' })
  groupId: number;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'group_name' })
  groupName: string;

  @Column({ type: 'int', nullable: false, name: 'created_by' })
  createdBy: number;
}

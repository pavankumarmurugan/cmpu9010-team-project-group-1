import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserModel } from './user.model';
import { BaseModel } from './base.model';

@Entity('search_history')
export class SearchHistoryModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Column({ type: 'int', name: 'user_id' })
  userId?: number;

  @Column({ type: 'varchar', name: 'search_query' })
  searchQuery?: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user_id' })
  user?: UserModel;
}

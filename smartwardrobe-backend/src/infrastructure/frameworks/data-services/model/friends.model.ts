// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { BaseModel } from './base.model';

// @Entity('friends')
// export class FriendsModel extends BaseModel {
//   @PrimaryGeneratedColumn({ name: 'friend_id' })
//   friendId: number;

//   @Column({ type: 'int', nullable: false, name: 'user1_id' })
//   user1Id: number;

//   @Column({ type: 'int', nullable: false, name: 'user2_id' })
//   user2Id: number;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseModel } from './base.model';
import { UserModel } from './user.model';

@Entity('friends')
export class FriendsModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'friend_id' })
  friendId: number;

  @Column({ type: 'int', nullable: false, name: 'user1_id' })
  user1Id: number;

  @Column({ type: 'int', nullable: false, name: 'user2_id' })
  user2Id: number;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user1_id' })
  user1?: UserModel;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'user2_id' })
  user2?: UserModel;
}

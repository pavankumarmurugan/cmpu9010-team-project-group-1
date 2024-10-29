import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('chat')
export class ChatModel extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, name: 'sender_id' })
  senderId?: number;

  @Column({ type: 'int', nullable: true, name: 'receiver_id' })
  receiverId?: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'text',
    name: 'message_type',
  })
  messageType?: string;

  @Column({ type: 'int', nullable: true, name: 'group_id' })
  groupId?: number;
}

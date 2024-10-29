import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('message_attachments')
export class MessageAttachmentsModel extends BaseModel {
  @PrimaryGeneratedColumn({ name: 'attachment_id' })
  attachmentId: number;

  @Column({ type: 'int', nullable: false, name: 'message_id' })
  messageId: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'attachment_type',
  })
  attachmentType: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  url: string;
}

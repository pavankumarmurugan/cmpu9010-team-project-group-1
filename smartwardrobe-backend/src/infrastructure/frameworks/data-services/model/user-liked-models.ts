import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('user_liked_models')
export class UserLikedModels extends BaseModel {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column({ name: 'user_id', nullable: false })
  readonly userId: number;

  @Column({ name: 'model_image_name', nullable: false, unique: true })
  readonly modelImageName: string;

  @Column({ name: 'model_image_url', nullable: false, unique: true })
  readonly modelImageUrl: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'vto_image_search' })
export class VtoImageSearchModel extends BaseModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'model_image_name', type: 'varchar', length: 255 })
  modelImageName?: string;

  @Column({ name: 'image_name', type: 'varchar', length: 255 })
  imageName?: string;

  @Column({ name: 'vto_s3_url', type: 'text' })
  vtoS3Url?: string;
}

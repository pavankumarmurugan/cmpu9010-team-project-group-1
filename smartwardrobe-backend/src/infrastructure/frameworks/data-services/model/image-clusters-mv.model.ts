import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('image_clusters_mv') // Name of the materialized view
export class ImageClustersMVModel {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  imageId: number;

  @Column({ type: 'text', unique: true, name: 'image_name' })
  imageName: string;

  @Column({ type: 'integer', name: 'cluster_id' })
  clusterId: number;

  @Column({ type: 'float8', array: true, name: 'clip_embedding' })
  clipEmbedding: number[];
}

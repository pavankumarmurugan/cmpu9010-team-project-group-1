import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('products')
export class ProductModel extends BaseModel {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column({ name: 'image_name', nullable: true })
  readonly imageName: string;

  @Column({ name: 'name' })
  readonly name?: string;

  @Column({ name: 'type', nullable: true })
  readonly type?: string;

  @Column({ name: 'pattern', nullable: true })
  readonly pattern?: string;

  @Column({ name: 'color', nullable: true })
  readonly color?: string;

  @Column({ name: 'color_shade', nullable: true })
  readonly colorShade?: string;

  @Column({ name: 'material', nullable: true })
  readonly material?: string;

  @Column({ name: 'occasion', nullable: true })
  readonly occasion?: string;

  @Column({ name: 'applicable_season', nullable: true })
  readonly applicableSeason?: string;

  @Column({ name: 'description', nullable: true })
  readonly description?: string;

  @Column({
    name: 'price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  readonly price?: number;

  @Column({ name: 'image_url', nullable: true })
  readonly imageUrl?: string;

  @Column({ name: 'trail', default: true, nullable: true })
  readonly trail?: boolean;
}

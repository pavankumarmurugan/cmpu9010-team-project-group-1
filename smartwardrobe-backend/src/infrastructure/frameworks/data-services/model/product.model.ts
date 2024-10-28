import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('products')
export class ProductModel extends BaseModel {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'varchar', length: 255, name: 'image_name' })
  readonly imageName?: string;

  @Column({ type: 'varchar', length: 50, name: 'color' })
  readonly color?: string;

  @Column({ type: 'varchar', length: 100, name: 'type' })
  readonly type?: string;

  @Column({ type: 'varchar', length: 100, name: 'style' })
  readonly style?: string;

  @Column({ type: 'varchar', length: 100, name: 'material' })
  readonly material?: string;

  @Column({ type: 'varchar', length: 100, name: 'category' })
  readonly category?: string;

  @Column({ type: 'varchar', length: 100, name: 'occasion' })
  readonly occasion?: string;

  @Column({ type: 'varchar', length: 100, name: 'neckline' })
  readonly neckline?: string;

  @Column({ type: 'varchar', length: 50, name: 'fit' })
  readonly fit?: string;

  @Column({ type: 'text', name: 'description' })
  readonly description?: string;

  @Column({ type: 'varchar', length: 255, name: 'image_url' })
  readonly imageUrl?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
  readonly price?: number;
}

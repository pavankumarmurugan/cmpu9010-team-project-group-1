import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('product_subcategory')
export class ProductSubcategoryModel extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id', type: 'int', nullable: false })
  categoryId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}

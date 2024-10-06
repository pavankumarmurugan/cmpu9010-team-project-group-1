import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_category')
export class ProductCategoryModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;
  @Column({ type: 'varchar', name: 'name' })
  readonly name: string;
  @Column({ type: 'text', name: 'desc' })
  readonly desc: string;
  @Column({ type: 'timestamp', name: 'created_at' })
  readonly createdAt?: Date;
  @Column({ type: 'timestamp', name: 'updated_at' })
  readonly updatedAt?: Date;
  @Column({ type: 'timestamp', name: 'deleted_at' })
  readonly deletedAt?: Date;
}

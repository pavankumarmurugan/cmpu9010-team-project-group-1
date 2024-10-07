import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ProductInventoryModel } from './product-inventory.model';
import { BaseModel } from './base.model';

@Entity('product')
export class ProductModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Column({ type: 'varchar', name: 'name' })
  readonly name: string;

  @Column({ type: 'text', name: 'desc' })
  readonly desc: string;

  @Column({ type: 'varchar', name: 'SKU' })
  readonly SKU: string;

  @Column({ type: 'int', name: 'category_id' })
  readonly categoryId: number;

  @Column({ type: 'int', name: 'discount_id' })
  readonly discountId: number;

  @Column({ type: 'int', name: 'price' })
  readonly price: number;

  @OneToOne(() => ProductInventoryModel, (inventory) => inventory.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  inventory?: ProductInventoryModel;
}

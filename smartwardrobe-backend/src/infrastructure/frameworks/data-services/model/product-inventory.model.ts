import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('product_inventory')
export class ProductInventoryModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Column({ type: 'int', name: 'quantity' })
  readonly quantity: number;

  @Column({ type: 'int', name: 'product_id' })
  readonly productId?: number;

  // @OneToOne(() => ProductModel, (product) => product.inventory)
  // @JoinColumn({ name: 'product_id' })
  // product?: ProductModel;
}

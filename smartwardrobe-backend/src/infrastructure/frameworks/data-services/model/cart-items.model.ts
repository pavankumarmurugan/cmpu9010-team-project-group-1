import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('cart_item')
export class CartItemModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;
  @Column({ type: 'int', name: 'session_id' })
  readonly sessionId: number;
  @Column({ type: 'int', name: 'product_id' })
  readonly productId: number;
  @Column({ type: 'int', name: 'quantity' })
  readonly quantity: number;
}
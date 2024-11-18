import { BaseEntity } from 'src/core/entities/base/base.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('like')
export class LikesModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, name: 'user_id' })
  userId?: number;

  @Column({ type: 'int', nullable: true, name: 'product_id' })
  productId?: number;

  @Column({ type: 'varchar', nullable: true, name: 'product_size' })
  productSize: string;
}

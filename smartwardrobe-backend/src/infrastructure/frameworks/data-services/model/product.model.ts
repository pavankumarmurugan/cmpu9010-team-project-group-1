import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('product')
export class ProductModel extends BaseModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  readonly id?: number;

  @Column({ type: 'varchar', name: 'article_id' })
  readonly articleId?: string;

  @Column({ type: 'varchar', name: 'product_code', nullable: true })
  readonly productCode?: string;

  @Column({ type: 'varchar', name: 'prod_name', nullable: true })
  readonly prodName?: string;

  @Column({ type: 'int', name: 'product_type_no', nullable: true })
  readonly productTypeNo?: number;

  @Column({ type: 'varchar', name: 'product_type_name', nullable: true })
  readonly productTypeName?: string;

  @Column({ type: 'varchar', name: 'product_group_name', nullable: true })
  readonly productGroupName?: string;

  @Column({ type: 'int', name: 'graphical_appearance_no', nullable: true })
  readonly graphicalAppearanceNo?: number;

  @Column({
    type: 'varchar',
    name: 'graphical_appearance_name',
    nullable: true,
  })
  readonly graphicalAppearanceName?: string;

  @Column({ type: 'varchar', name: 'colour_group_code', nullable: true })
  readonly colourGroupCode?: string;

  @Column({ type: 'varchar', name: 'colour_group_name', nullable: true })
  readonly colourGroupName?: string;

  @Column({ type: 'int', name: 'perceived_colour_value_id', nullable: true })
  readonly perceivedColourValueId?: number;

  @Column({
    type: 'varchar',
    name: 'perceived_colour_value_name',
    nullable: true,
  })
  readonly perceivedColourValueName?: string;

  @Column({ type: 'int', name: 'perceived_colour_master_id', nullable: true })
  readonly perceivedColourMasterId?: number;

  @Column({
    type: 'varchar',
    name: 'perceived_colour_master_name',
    nullable: true,
  })
  readonly perceivedColourMasterName?: string;

  @Column({ type: 'int', name: 'department_no', nullable: true })
  readonly departmentNo?: number;

  @Column({ type: 'varchar', name: 'department_name', nullable: true })
  readonly departmentName?: string;

  @Column({ type: 'varchar', name: 'index_code', nullable: true })
  readonly indexCode?: string;

  @Column({ type: 'varchar', name: 'index_name', nullable: true })
  readonly indexName?: string;

  @Column({ type: 'int', name: 'index_group_no', nullable: true })
  readonly indexGroupNo?: number;

  @Column({ type: 'varchar', name: 'index_group_name', nullable: true })
  readonly indexGroupName?: string;

  @Column({ type: 'int', name: 'section_no', nullable: true })
  readonly sectionNo?: number;

  @Column({ type: 'varchar', name: 'section_name', nullable: true })
  readonly sectionName?: string;

  @Column({ type: 'int', name: 'garment_group_no', nullable: true })
  readonly garmentGroupNo?: number;

  @Column({ type: 'varchar', name: 'garment_group_name', nullable: true })
  readonly garmentGroupName?: string;

  @Column({ type: 'text', name: 'detail_desc', nullable: true })
  readonly detailDesc?: string;

  @Column({ type: 'varchar', name: 'sku', nullable: true })
  readonly sku?: string;

  @Column({ type: 'int', name: 'category_id', nullable: true })
  readonly categoryId?: number;

  @Column({ type: 'int', name: 'inventory_id', nullable: true })
  readonly inventoryId?: number;

  @Column({ type: 'decimal', name: 'price', nullable: true })
  readonly price?: number;

  @Column({ type: 'int', name: 'discount_id', nullable: true })
  readonly discountId?: number;

  @Column({ type: 'varchar', name: 'image_url', nullable: true })
  readonly imageUrl?: string; // Added column for image URL

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  readonly createdAt?: Date;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  readonly updatedAt?: Date;

  @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
  readonly deletedAt?: Date;

  // @OneToOne(() => ProductInventoryModel, (inventory) => inventory.product, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // inventory?: ProductInventoryModel;
}

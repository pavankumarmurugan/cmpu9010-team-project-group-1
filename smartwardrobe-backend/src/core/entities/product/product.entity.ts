import { BaseEntity } from '../base/base.entity';
import { ProductInventoryEntity } from '../product-inventory/product-inventory.entity';

export class ProductEntity extends BaseEntity {
  readonly id?: number;
  readonly articleId?: string;
  readonly productCode?: string;
  readonly prodName?: string;
  readonly productTypeNo?: number;
  readonly productTypeName?: string;
  readonly productGroupName?: string;
  readonly graphicalAppearanceNo?: number;
  readonly graphicalAppearanceName?: string;
  readonly colourGroupCode?: string;
  readonly colourGroupName?: string;
  readonly perceivedColourValueId?: number;
  readonly perceivedColourValueName?: string;
  readonly perceivedColourMasterId?: number;
  readonly perceivedColourMasterName?: string;
  readonly departmentNo?: number;
  readonly departmentName?: string;
  readonly indexCode?: string;
  readonly indexName?: string;
  readonly indexGroupNo?: number;
  readonly indexGroupName?: string;
  readonly sectionNo?: number;
  readonly sectionName?: string;
  readonly garmentGroupNo?: number;
  readonly garmentGroupName?: string;
  readonly detailDesc?: string;
  readonly sku?: string;
  readonly categoryId?: number;
  // readonly inventory?: ProductInventoryEntity;
  readonly inventoryId?: number;
  readonly discountId?: number;
  readonly price?: number;
  readonly imageUrl?: string; // Added column for image URL
}

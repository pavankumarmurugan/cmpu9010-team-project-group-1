import { Injectable } from '@nestjs/common';
import { ProductInventoryReqDto } from 'src/core/dto/product-inventory/product-inventory-req-dto';
import { UpdateProductInventoryCategoryReqDto } from 'src/core/dto/product-inventory/product-inventory-req-update-dto';
import { ProductInventoryResDto } from 'src/core/dto/product-inventory/product-inventory-res-dto';
import { ProductInventoryEntity } from 'src/core/entities/product-inventory/product-inventory.entity';

@Injectable()
export class ProductInventoryConvertor {
  toProductResDtoFromEntity(
    entity: ProductInventoryEntity,
  ): ProductInventoryResDto {
    return { ...entity };
  }

  toProductResDtoFromEntities(
    entity: ProductInventoryEntity[],
  ): ProductInventoryResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toProductModelFromDto(dto: ProductInventoryReqDto): ProductInventoryEntity {
    return {
      ...dto,
    };
  }

  toUpdateProductModelFromDto(
    dto: UpdateProductInventoryCategoryReqDto,
  ): ProductInventoryEntity {
    return {
      ...dto,
      id: undefined,
      updatedAt: new Date(),
    };
  }
}

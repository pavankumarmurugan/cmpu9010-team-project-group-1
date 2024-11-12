import { Injectable } from '@nestjs/common';
import { ProductCategoryReqDto } from 'src/core/dto/product-category/product-category-req-dto';
import { UpdateProductCategoryReqDto } from 'src/core/dto/product-category/product-category-req-update-dto';
import { ProductCategoryResDto } from 'src/core/dto/product-category/product-category-res-dto';
import { ProductCategoryEntity } from 'src/core/entities/product-category/product-category.entity';
import { ProductSubcategoryEntity } from 'src/core/entities/product-subcategory/product-subcategory.entity';

@Injectable()
export class ProductCategoryConvertor {
  // toProductResDtoFromEntity(
  //   data: ProductCategoryEntity,
  // ): ProductCategoryResDto {
  //   return { ...data };
  // }

  toProductResDtoFromEntities(
    data: ProductCategoryEntity[],
    productSubcategoryEntities: ProductSubcategoryEntity[],
  ): ProductCategoryResDto[] {
    return data.map((item) => ({
      ...item,
      subCategories: productSubcategoryEntities
        .filter((subCategory) => subCategory.categoryId === item.id)
        .map((subCategory) => subCategory.name),
    }));
  }

  // toProductModelFromDto(
  //   productCategoryReqDto: ProductCategoryReqDto,
  // ): ProductCategoryEntity {
  //   return {
  //     ...productCategoryReqDto,
  //   };
  // }

  // toUpdateProductModelFromDto(
  //   updateProductCategoryReqDto: UpdateProductCategoryReqDto,
  // ): ProductCategoryEntity {
  //   return {
  //     ...updateProductCategoryReqDto,
  //     id: undefined,
  //     updatedAt: new Date(),
  //   };
  // }
}

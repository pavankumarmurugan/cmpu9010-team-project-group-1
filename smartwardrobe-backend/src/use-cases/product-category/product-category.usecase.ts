import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ProductCategoryConvertor } from 'src/core/convertors/product-category/product-category.convertor';
import { ProductCategoryResDto } from 'src/core/dto/product-category/product-category-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';

@Injectable()
export class ProductCategoryUsecase {
  constructor(
    private databaseService: IDataServices,
    private convertor: ProductCategoryConvertor,
    private cacheService: CacheService,
  ) {}

  //   async create(
  //     dto: ProductCategoryReqDto,
  //   ): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       const productCategoryEntity: ProductCategoryEntity =
  //         this.convertor.toProductModelFromDto(dto);
  //       const entity: ProductCategoryEntity =
  //         await this.databaseService.productCategory.create(
  //           productCategoryEntity,
  //         );
  //       const data: ProductCategoryResDto =
  //         this.convertor.toProductResDtoFromEntity(entity);
  //       return {
  //         data,
  //         message: MESSAGES.PRODUCT_CATEGORY.CREATE.SUCCESS,
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  async getAll(): Promise<IResponse<ProductCategoryResDto[]>> {
    try {
      // const entities: ProductCategoryEntity[] =
      //   await this.databaseService.productCategory.getAll();

      // const productSubcategoryEntities: ProductSubcategoryEntity[] =
      //   await this.databaseService.productSubcategory.getAll();

      const cacheKey = 'product-category';

      const cachedData =
        await this.cacheService.getFromCache<ProductCategoryResDto[]>(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          message: MESSAGES.PRODUCT.GET.SUCCESS + ' (from cache)',
        };
      }

      const [entities, productSubcategoryEntities] = await Promise.all([
        this.databaseService.productCategory.getAll(),
        this.databaseService.productSubcategory.getAll(),
      ]);

      const data: ProductCategoryResDto[] =
        this.convertor.toProductResDtoFromEntities(
          entities,
          productSubcategoryEntities,
        );

      await this.cacheService.setToCache(cacheKey, data);

      return {
        data,
        message: MESSAGES.PRODUCT_CATEGORY.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  //   async update(
  //     dto: UpdateProductCategoryReqDto,
  //   ): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       const { id } = dto;

  //       const productEntity: ProductCategoryEntity =
  //         this.convertor.toUpdateProductModelFromDto(dto);

  //       await this.databaseService.productCategory.update(id, productEntity);

  //       return {
  //         data: null,
  //         message: MESSAGES.PRODUCT_CATEGORY.UPDATE.SUCCESS,
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async delete(id: number): Promise<IResponse<null>> {
  //     try {
  //       await this.databaseService.productCategory.delete(id);
  //       return {
  //         data: null,
  //         message: MESSAGES.PRODUCT_CATEGORY.DELETE.SUCCESS,
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  //   async getOne(id: number): Promise<IResponse<ProductCategoryResDto>> {
  //     try {
  //       const data: ProductCategoryEntity =
  //         await this.databaseService.productCategory.get({ id });
  //       return {
  //         data,
  //         message: MESSAGES.PRODUCT_CATEGORY.GET.SUCCESS,
  //       };
  //     } catch (error) {
  //       throw error;
  //     }
  //   }
}

import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ProductConvertor } from 'src/core/convertors/product/product.convertor';
import { ProductReqDto } from 'src/core/dto/product/product-req-dto';
import { ProductReqUpdateDto } from 'src/core/dto/product/product-req-update-dto';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';
import { ProductEntity } from 'src/core/entities/product/product.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';

@Injectable()
export class ProductUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    private readonly productConvertor: ProductConvertor,
    private readonly cacheService: CacheService,
  ) {}

  // async create(
  //   productReqDto: ProductReqDto,
  // ): Promise<IResponse<ProductResDto>> {
  //   try {
  //     const productEntity: ProductEntity =
  //       this.productConvertor.toProductModelFromDto(productReqDto);
  //     const entity: ProductEntity =
  //       await this.databaseService.product.create(productEntity);
  //     const data: ProductResDto =
  //       this.productConvertor.toProductResDtoFromEntity(entity);

  //     return {
  //       data,
  //       message: MESSAGES.PRODUCT.CREATE.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getAllProduct(
    page: number,
    limit: number,
  ): Promise<IResponse<ProductResDto[]>> {
    try {
      const cacheKey = `products:${page}:${limit}`;

      const cachedData =
        await this.cacheService.getFromCache<ProductResDto[]>(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          message: MESSAGES.PRODUCT.GET.SUCCESS + ' (from cache)',
        };
      }

      const { data: entities }: { data: ProductEntity[]; total: number } =
        await this.databaseService.product.getAllPaginated(page, limit);

      const data: ProductResDto[] =
        this.productConvertor.toProductResDtoFromEntities(entities);

      await this.cacheService.setToCache<ProductResDto[]>(cacheKey, data);

      return {
        data,
        message: MESSAGES.PRODUCT.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // async update(
  //   productReqUpdateDto: ProductReqUpdateDto,
  // ): Promise<IResponse<ProductResDto>> {
  //   try {
  //     const { id } = productReqUpdateDto;

  //     const productEntity: ProductEntity =
  //       this.productConvertor.toUpdateProductModelFromDto(productReqUpdateDto);

  //     await this.databaseService.product.update(id, productEntity);

  //     return {
  //       data: null,
  //       message: MESSAGES.PRODUCT.UPDATE.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async delete(id: number): Promise<IResponse<ProductResDto>> {
  //   try {
  //     await this.databaseService.product.delete(id);
  //     return {
  //       data: null,
  //       message: MESSAGES.PRODUCT.DELETE.SUCCESS,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getOne(id: number): Promise<IResponse<ProductResDto>> {
    try {
      const data = await this.databaseService.product.get({ id });
      return {
        data,
        message: MESSAGES.PRODUCT.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}

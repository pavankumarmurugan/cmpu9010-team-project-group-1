import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { ProductConvertor } from 'src/core/convertors/product/product.convertor';
import {
  CATEGORY_SUBCATEGORY_MAP,
  VALID_COLORS,
  VALID_MATERIALS,
  VALID_OCCASIONS,
  VALID_PATTERNS,
} from 'src/core/dto/filters/categories.map';
import { GetFiltersResponseDto } from 'src/core/dto/filters/get-filters-response.dto';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';
import { PaginatedResponse } from 'src/core/interface/paginated.interface';
import { IResponse } from 'src/core/interface/response.interface';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';
import { Between } from 'typeorm';

@Injectable()
export class FiltersUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    private readonly productConvertor: ProductConvertor,
    private readonly cacheService: CacheService,
  ) {}

  async getAll(): Promise<IResponse<GetFiltersResponseDto>> {
    return {
      data: {
        colors: VALID_COLORS,
        materials: VALID_MATERIALS,
        occasions: VALID_OCCASIONS,
        categories: CATEGORY_SUBCATEGORY_MAP,
        patterns: VALID_PATTERNS,
      },
      message: 'Success',
    };
  }

  async filterByPriceAndColor(
    page: number = 1,
    limit: number = 10,
    minPrice?: number,
    maxPrice?: number,
    color?: string,
    material?: string,
    occasion?: string,
    category?: string,
    type?: string,
    trail?: boolean,
    pattern?: string,
  ): Promise<IResponse<PaginatedResponse<ProductResDto[]>>> {
    try {
      const cacheKey = `filters:${page}:${limit}:${minPrice || 0}:${maxPrice || 'MAX'}:${color || ''}:${material || ''}:${occasion || ''}:${category || ''}:${type || ''}:${trail || false} ${pattern || ''}`;

      const cachedData =
        await this.cacheService.getFromCache<
          PaginatedResponse<ProductResDto[]>
        >(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          message: 'Filtered products retrieved successfully (from cache)',
        };
      }

      const where: Record<string, any> = {};

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = Between(
          minPrice ?? 0,
          maxPrice ?? Number.MAX_SAFE_INTEGER,
        );
      }

      if (color) where.color = color;
      if (material) where.material = material;
      if (occasion) where.occasion = occasion;
      if (category) where.category = category;
      if (type) where.type = type;
      if (trail) where.trail = trail;
      if (pattern) where.pattern = pattern;

      const { data: products, total } =
        await this.databaseService.product.getAllPaginatedWithWhere(
          page,
          limit,
          where,
        );

      const dto = this.productConvertor.toProductResDtoFromEntities(products);

      const data: PaginatedResponse<ProductResDto[]> = {
        items: dto,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      await this.cacheService.setToCache<PaginatedResponse<ProductResDto[]>>(
        cacheKey,
        data,
      );
      return {
        data,
        message: 'Filtered products retrieved successfully.',
      };
    } catch (error) {
      throw error;
    }
  }
}

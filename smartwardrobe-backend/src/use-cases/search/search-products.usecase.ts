import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { SearchProductsService } from 'src/infrastructure/services/search/search-products.service';
import { IDataServices } from 'src/core/abstracts';
import { ProductConvertor } from 'src/core/convertors/product/product.convertor';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';
import { SearchImageSimilarProductResDto } from 'src/core/dto/search/search-image-similar-products-res-dto';
import { AxiosResponse } from 'axios';
import { ProductEntity } from 'src/core/entities/product/product.entity';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';
import {
  createTextResultsEntity,
  TextResultsEntity,
} from 'src/core/entities/text-ai/text-ai.entity';
import { SearchImageSimilarProductsConvertor } from 'src/core/convertors/search/search-image-similar-products.convertor';
import { SearchImageSimilarProductResDtoV2 } from 'src/core/dto/search/search-image-similar-products-res_v2-dto';

@Injectable()
export class SearchProductUsecase {
  constructor(
    private readonly services: SearchProductsService,
    private readonly databaseService: IDataServices,
    private readonly convertor: SearchImageSimilarProductsConvertor,
    private readonly cacheService: CacheService,
  ) {}

  async searchSimilarItemsToImage(
    filePath: string,
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IResponse<SearchImageSimilarProductResDtoV2>> {
    const cacheKey = `similarProducts:${filePath.trim()}:${query.trim()}:${page}:${limit}`;

    const cachedData =
      await this.cacheService.getFromCache<SearchImageSimilarProductResDtoV2>(
        cacheKey,
      );
    if (cachedData) {
      return {
        data: cachedData,
        message: MESSAGES.PRODUCT.GET.SUCCESS + ' (from cache)',
      };
    }

    try {
      let imageSearchResults: AxiosResponse<SearchImageSimilarProductResDto[]> =
        {
          data: [],
          status: 200,
          statusText: 'OK',
          headers: {},
          config: null,
        };
      let textSearchResults: AxiosResponse<TextResultsEntity> = {
        data: createTextResultsEntity(),
        status: 200,
        statusText: 'OK',
        headers: {},
        config: null,
      };

      if (filePath !== '') {
        imageSearchResults = await await firstValueFrom(
          this.services.searchProductToSimilarImages(filePath),
        );
      }

      if (query !== '') {
        textSearchResults = await await firstValueFrom(
          this.services.searchUsingNLP(query),
        );
      }

      const results: SearchImageSimilarProductResDto[] =
        imageSearchResults.data.concat(textSearchResults.data.search_results);

      const unique = results.filter((v, i, a) => {
        const seen = new Set();
        return a.filter(
          (item) => !seen.has(item.image_name) && seen.add(item.image_name),
        );
      });

      const pages = unique.slice((page - 1) * limit, page * limit);

      const entities = await Promise.all(
        pages.map(async ({ image_name }) =>
          this.databaseService.product.get({ imageName: image_name }),
        ),
      );
      const productEntities: ProductEntity[] = entities.filter(
        (entity) => entity !== null,
      );

      const data: SearchImageSimilarProductResDtoV2 =
        this.convertor.toProductResDtoFromEntitiesForSearchResults(
          textSearchResults.data,
          productEntities,
        );

      await this.cacheService.setToCache<SearchImageSimilarProductResDtoV2>(
        cacheKey,
        data,
      );

      return {
        data,
        message: MESSAGES.PRODUCT.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}

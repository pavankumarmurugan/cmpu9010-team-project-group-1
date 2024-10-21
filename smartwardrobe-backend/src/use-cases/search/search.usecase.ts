import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SearchImageSimilarProductsConvertor } from 'src/core/convertors/search/search-image-similar-products.convertor';
import { SearchImageSimilarProductResDto } from 'src/core/dto/search/search-image-similar-products-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { SearchService } from 'src/infrastructure/services/search/search';

@Injectable()
export class SearchProductUsecase {
  constructor(
    private services: SearchService,
    private convertor: SearchImageSimilarProductsConvertor,
  ) {}

  async getAll(): Promise<IResponse<SearchImageSimilarProductResDto[]>> {
    try {
      const data = await firstValueFrom(this.services.findAll());
      return {
        data: data.data,
        message: MESSAGES.SEARCH.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}

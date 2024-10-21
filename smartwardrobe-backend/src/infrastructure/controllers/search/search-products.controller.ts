import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchImageSimilarProductResDto } from 'src/core/dto/search/search-image-similar-products-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { SearchProductUsecase } from 'src/use-cases/search/search.usecase';

@Controller('search')
@ApiTags('Search')
export class SearchSimilarProductsController {
  constructor(private usecase: SearchProductUsecase) {}

  @Get('get-all-similar-products-to-image')
  async searchProducts(): Promise<
    IResponse<SearchImageSimilarProductResDto[]>
  > {
    try {
      return await this.usecase.getAll();
    } catch (error) {
      throw error;
    }
  }
}

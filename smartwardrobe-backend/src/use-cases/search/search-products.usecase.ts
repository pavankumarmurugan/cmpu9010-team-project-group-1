import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { SearchProductsService } from 'src/infrastructure/services/search/search-products.service';
import { IDataServices } from 'src/core/abstracts';
import { ProductConvertor } from 'src/core/convertors/product/product.convertor';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';

@Injectable()
export class SearchProductUsecase {
  constructor(
    private services: SearchProductsService,
    private databaseService: IDataServices,
    private productConvertor: ProductConvertor,
  ) {}

  async searchSimilarItemsToImage(
    filePath: string,
  ): Promise<IResponse<ProductResDto[]>> {
    try {
      const imageSearchResults = await await firstValueFrom(
        this.services.searchProductToSimilarImages(filePath),
      );
      const entities = await Promise.all(
        imageSearchResults.data.map(async ({ image_name }) =>
          this.databaseService.product.get({ imageName: image_name }),
        ),
      );
      const data: ProductResDto[] =
        this.productConvertor.toProductResDtoFromEntities(entities);

      return {
        data,
        message: MESSAGES.PRODUCT.GET.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}

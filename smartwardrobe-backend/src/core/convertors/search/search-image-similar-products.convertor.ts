import { Injectable } from '@nestjs/common';
import { SearchImageSimilarProductResDtoV2 } from 'src/core/dto/search/search-image-similar-products-res_v2-dto';
import { ProductEntity } from 'src/core/entities/product/product.entity';
import { TextResultsEntity } from 'src/core/entities/text-ai/text-ai.entity';

@Injectable()
export class SearchImageSimilarProductsConvertor {
  toProductResDtoFromEntitiesForSearchResults(
    textResults: TextResultsEntity,
    data: ProductEntity[],
  ): SearchImageSimilarProductResDtoV2 {
    return {
      expectedQueries: textResults.expanded_queries,
      products: data.map((item) => ({ ...item })),
    };
  }
}

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Observable } from 'rxjs';
import { SearchImageSimilarProductResDto } from 'src/core/dto/search/search-image-similar-products-res-dto';
import { BASE_URL } from 'src/infrastructure/common/enum.ts/url.enum';

@Injectable()
export class SearchProductsService {
  constructor(private readonly httpService: HttpService) {}

  searchProductToSimilarImages(
    filePath: string,
  ): Observable<AxiosResponse<SearchImageSimilarProductResDto[]>> {
    const url = `${BASE_URL.IMAGE_SEARCH}/image-search`;
    return this.httpService.post(url, {
      image_url: filePath,
    });
  }

  searchUsingNLP(
    filePath: string,
  ): Observable<AxiosResponse<SearchImageSimilarProductResDto[]>> {
    const url = `${BASE_URL.IMAGE_SEARCH}/image-search`;
    return this.httpService.post(url, {
      image_url: filePath,
    });
  }
}

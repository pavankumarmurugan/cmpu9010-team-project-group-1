import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Observable } from 'rxjs';
import { SearchImageSimilarProductResDto } from 'src/core/dto/search/search-image-similar-products-res-dto';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}

  findAll(): Observable<AxiosResponse<SearchImageSimilarProductResDto[]>> {
    return this.httpService.get('127.0.0.1:5000/search');
  }
}

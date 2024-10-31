import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { VtoImageSearchConvertor } from 'src/core/convertors/vto/vto-dto.convertor';
import { VtoImageSearchResDto } from 'src/core/dto/vto/vto.res-dto';
import { VtoImageSearchEntity } from 'src/core/entities/vto/vto.entity';

import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';

@Injectable()
export class VtoImageSearchUsecase {
  constructor(
    private dataService: IDataServices,
    private convertor: VtoImageSearchConvertor,
    private readonly cacheService: CacheService,
  ) {}

  async getAll(imageName: string): Promise<IResponse<VtoImageSearchResDto[]>> {
    const cacheKey = `vto:${imageName}`;

    const cachedData =
      await this.cacheService.getFromCache<VtoImageSearchResDto[]>(cacheKey);
    if (cachedData) {
      return {
        data: cachedData,
        message: MESSAGES.PRODUCT.GET.SUCCESS + ' (from cache)',
      };
    }

    const entities = await this.dataService.vtoImageSearch.getAllByProperties({
      imageName,
    });
    const data: VtoImageSearchResDto[] = entities.map((entity) =>
      this.convertor.toResDtoFromEntity(entity),
    );

    await this.cacheService.setToCache<VtoImageSearchResDto[]>(cacheKey, data);

    return {
      data,
      message: MESSAGES.VTO_IMAGE_SEARCH.GET_ALL.SUCCESS,
    };
  }
}

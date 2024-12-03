import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { SearchHistoryConvertor } from 'src/core/convertors/search-history/search-history.convertor';
import { SearchHistoryResDTO } from 'src/core/dto/search-history/search-history.res.dto';
import { SearchHistoryEntity } from 'src/core/entities/search-history/search-history.entity';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';

@Injectable()
export class SearchHistoryUsecase {
  constructor(
    private readonly databaseService: IDataServices,
    private readonly convertor: SearchHistoryConvertor,
  ) {}

  async getLatestSearchHistory(
    userId: number,
    limit: number,
  ): Promise<IResponse<SearchHistoryResDTO[]>> {
    try {
      const searchHistoryEntities =
        await this.databaseService.searchHistory.getAllByPropertiesV2(
          { userId },
          [],
        );

      const data = this.convertor.toDTO(searchHistoryEntities, limit);

      return {
        data,
        message: MESSAGES.SEARCH_HISTORY.GET_ALL.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async addSearchHistory(
    userId: number,
    query: string,
  ): Promise<IResponse<null>> {
    try {
      const searchHistoryEntity: SearchHistoryEntity = {
        userId,
        searchQuery: query,
        createdAt: new Date(),
      };

      await this.databaseService.searchHistory.create(searchHistoryEntity);

      return {
        data: null,
        message: MESSAGES.SEARCH_HISTORY.ADD.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteSearchHistory(
    historyId: number,
    userId: number,
  ): Promise<IResponse<null>> {
    try {
      const searchHistory = await this.databaseService.searchHistory.get({
        id: historyId,
        userId,
      });

      if (!searchHistory) {
        throw new Error(MESSAGES.SEARCH_HISTORY.NOT_FOUND);
      }

      await this.databaseService.searchHistory.delete(historyId);

      return {
        data: null,
        message: MESSAGES.SEARCH_HISTORY.DELETE.SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { SearchHistoryResDTO } from 'src/core/dto/search-history/search-history.res.dto';
import { SearchHistoryEntity } from 'src/core/entities/search-history/search-history.entity';

@Injectable()
export class SearchHistoryConvertor {
  toDTO(
    searchHistoryEntities: SearchHistoryEntity[],
    limit: number,
  ): SearchHistoryResDTO[] {
    const uniqueEntities = Array.from(
      new Map(
        searchHistoryEntities.map((entity) => [entity.searchQuery, entity]),
      ).values(),
    );
    return uniqueEntities
      .map((entity) => ({
        id: entity.id,
        userId: entity.userId,
        searchQuery: entity.searchQuery,
        createdAt: entity.createdAt,
      }))
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }
}

import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { RecommendationsResDto } from 'src/core/dto/recommendations/recommendations-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { CacheService } from 'src/infrastructure/services/cache/cache.service';
import { FaissService } from 'src/infrastructure/services/faiss/faiss.service';
@Injectable()
export class RecommendationUsecase {
  constructor(
    private readonly faissService: FaissService,
    private readonly dataService: IDataServices,
    private readonly cacheService: CacheService,
  ) {}

  public async findSimilarProducts(
    imageName: string,
    topN: number,
  ): Promise<IResponse<RecommendationsResDto[]>> {
    try {
      const cacheKey = `similarProducts:${imageName}:${topN}`;

      const cachedData =
        await this.cacheService.getFromCache<RecommendationsResDto[]>(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS + ' (from cache)',
        };
      }

      const imageData = this.faissService.getImageData();
      const embeddingMatrix = this.faissService.getEmbeddingMatrix();

      const targetImage = imageData.find((img) => img.imageName === imageName);
      if (!targetImage) {
        return { data: [], message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS };
      }

      const targetIdx = imageData.indexOf(targetImage);
      const targetVector = embeddingMatrix[targetIdx];

      const results = this.faissService.findSimilarEmbeddings(
        targetVector,
        topN + 1,
      );
      const { labels, distances } = results;

      const similarImages = labels
        .filter((label) => label !== targetIdx)
        .map((label, i) => ({
          imageName: imageData[label].imageName,
          similarity: distances[i] * 100,
          cluster: imageData[label].clusterId,
        }))
        .slice(0, topN);

      const imageNames = similarImages.map((item) => item.imageName);
      const result = await this.dataService.product.getAllByIdsIn(
        imageNames,
        'imageName',
      );

      await this.cacheService.setToCache<RecommendationsResDto[]>(
        cacheKey,
        result.flat(),
      );

      return {
        data: result.flat(),
        message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS,
      };
    } catch (error) {
      console.error('Error finding similar images:', error);
      throw new Error('Failed to find similar images');
    }
  }
}

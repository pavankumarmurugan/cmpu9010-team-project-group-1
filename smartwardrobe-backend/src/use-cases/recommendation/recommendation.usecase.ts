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

  /**
   * Finds similar products based on the given image name and number of results required.
   * @param imageName - Name of the image to find similar products for.
   * @param topN - Number of top similar results to return.
   * @returns List of recommended products with similarity scores.
   */
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
          message: `${MESSAGES.RECOMMENDATIONS.GET.SUCCESS} (from cache)`,
        };
      }

      console.log(`Fetching target embedding for image: ${imageName}`);
      const targetData = await this.getTargetEmbedding(imageName);

      if (!targetData) {
        return {
          data: [],
          message: `${MESSAGES.RECOMMENDATIONS.GET.SUCCESS} - No matching data`,
        };
      }

      const { targetEmbedding, imageData } = targetData;

      console.log(`Finding similar embeddings for image: ${imageName}`);
      const results = await this.faissService.findSimilarEmbeddings(
        targetEmbedding,
        topN + 1, // Include the target image to filter it out later.
      );

      if (!results.labels.length) {
        return {
          data: [],
          message: `${MESSAGES.RECOMMENDATIONS.GET.SUCCESS} - No similar products found`,
        };
      }

      const { labels, distances } = results;

      // Map FAISS results back to image metadata
      const similarImages = labels
        .filter((label) => imageData[label].imageName !== imageName) // Exclude the target image itself
        .map((label, i) => ({
          imageName: imageData[label].imageName,
          similarity: (1 - distances[i]) * 100, // Convert L2 distance to similarity percentage
          cluster: imageData[label].clusterId,
        }))
        .slice(0, topN); // Return only the top-N results

      console.log(`Similar embeddings found: ${JSON.stringify(similarImages)}`);

      // Fetch additional product details based on image names
      const imageNames = similarImages
        .filter((item) => item.imageName != imageName)
        .map((item) => item.imageName);
      const productDetails = await this.dataService.product.getAllByIdsIn(
        imageNames,
        'imageName',
      );

      // Filter the final product list and cache the results
      const data = productDetails.flat();
      await this.cacheService.setToCache(cacheKey, data);

      return {
        data: data,
        message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS,
      };
    } catch (error) {
      console.error('Error in findSimilarProducts:', error.message);
      return {
        data: [],
        message: `${MESSAGES.RECOMMENDATIONS.GET.ERROR} - ${error.message}`,
      };
    }
  }

  /**
   * Retrieves the target embedding for a specific image.
   * @param imageName - Name of the image to fetch the embedding for.
   * @returns Embedding and image metadata or null if not found.
   */
  private async getTargetEmbedding(imageName: string): Promise<{
    targetEmbedding: number[];
    imageData: { imageName: string; clusterId: number }[];
  } | null> {
    try {
      const targetData = await this.faissService.findTargetEmbedding(imageName);
      if (!targetData || !targetData.targetEmbedding) {
        console.warn(`No target embedding found for image: ${imageName}`);
        return null;
      }
      return targetData;
    } catch (error) {
      console.error('Error retrieving target embedding:', error.message);
      throw new Error('Failed to retrieve target embedding');
    }
  }
}

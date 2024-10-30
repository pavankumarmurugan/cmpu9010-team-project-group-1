import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { RecommendationsResDto } from 'src/core/dto/recommendations/recommendations-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { FaissService } from 'src/infrastructure/services/faiss/faiss.service';

@Injectable()
export class RecommendationUsecase {
  constructor(
    private readonly faissService: FaissService,
    private readonly dataService: IDataServices,
  ) {}

  public async findSimilarProducts(
    imageName: string,
    topN: number,
  ): Promise<IResponse<RecommendationsResDto[]>> {
    try {
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

      const result = await Promise.all(
        similarImages.map((item) =>
          this.dataService.product.getAllByProperties({
            imageName: item.imageName,
          }),
        ),
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

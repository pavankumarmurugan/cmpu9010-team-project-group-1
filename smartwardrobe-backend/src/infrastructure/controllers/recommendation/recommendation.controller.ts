import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecommendationsReqDto } from 'src/core/dto/recommendations/recommendations-req-dto';
import { RecommendationsResDto } from 'src/core/dto/recommendations/recommendations-res-dto';
import { IResponse } from 'src/core/interface/response.interface';
import { RecommendationUsecase } from 'src/use-cases/recommendation/recommendation.usecase';

@Controller('recommend')
@ApiTags('Recommendation')
export class RecommendationController {
  constructor(private readonly recommendationUsecase: RecommendationUsecase) {}

  @Post('similar-products')
  async findSimilarProducts(
    @Body() recommendationsReqDto: RecommendationsReqDto,
  ): Promise<IResponse<RecommendationsResDto[]>> {
    try {
      const { imageName, topN } = recommendationsReqDto;
      const similarImages =
        await this.recommendationUsecase.findSimilarProducts(imageName, topN);
      return similarImages;
    } catch (error) {
      console.error('Error finding similar images:', error);
      throw error;
    }
  }
}

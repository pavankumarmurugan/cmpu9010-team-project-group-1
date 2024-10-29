import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as faiss from 'faiss-node';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { ImageClusterEntity } from 'src/core/entities/image-cluster/image-cluster.entity';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';
import { IDataServices } from 'src/core/abstracts';
import { RecommendationsResDto } from 'src/core/dto/recommendations/recommendations-res-dto';
import { IResponse } from 'src/core/interface/response.interface';

@Injectable()
export class RecommendationUsecase implements OnModuleInit {
  private faissIndex: faiss.IndexFlatL2;
  private imageData: ImageClusterEntity[] = [];
  private embeddingMatrix: number[][] = [];

  constructor(
    @InjectRepository(ImageClusterModel)
    private readonly imageClusterRepository: Repository<ImageClusterEntity>,
    private dataService: IDataServices,
  ) {}

  async onModuleInit() {
    await this.initializeFaissIndex();
  }

  async initializeFaissIndex(): Promise<void> {
    try {
      const imageClusterEntity: ImageClusterEntity[] =
        await this.imageClusterRepository.find();

      if (imageClusterEntity.length === 0) {
        throw new Error('No data found in image_clusters table');
      }

      const embeddings: number[][] = [];

      imageClusterEntity
        .filter(({ clipEmbedding }) => clipEmbedding.length > 0)
        .forEach(({ clipEmbedding, imageName, clusterId }) => {
          embeddings.push(clipEmbedding);
          this.imageData.push({ imageName, clusterId });
        });

      if (embeddings.length === 0) {
        throw new Error('No valid embeddings found for FAISS index');
      }

      const dimension = embeddings[0].length;
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      embeddings.forEach((embedding) => this.faissIndex.add(embedding));
      this.embeddingMatrix = embeddings;

      console.log(
        `FAISS index initialized with ${this.faissIndex.ntotal()} embeddings.`,
      );
    } catch (error) {
      console.error('Error initializing FAISS index:', error);
      throw new Error('Failed to initialize FAISS index');
    }
  }

  public async findSimilarProducts(
    imageName: string,
    topN: number,
  ): Promise<IResponse<RecommendationsResDto[]>> {
    try {
      const targetImage = this.imageData.find(
        (img) => img.imageName === imageName,
      );
      if (!targetImage) {
        console.warn(`Image ${imageName} not found in dataset`);
        return {
          data: [],
          message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS,
        };
      }

      const targetIdx = this.imageData.indexOf(targetImage);
      const targetVector = this.embeddingMatrix[targetIdx];

      const results = this.faissIndex.search(targetVector, topN + 1);
      const { labels, distances } = results;

      const similarImages = labels
        .map((label, i) => {
          if (label !== targetIdx) {
            const similarImage = this.imageData[label];
            return {
              imageName: similarImage.imageName,
              similarity: distances[i] * 100,
              cluster: similarImage.clusterId,
            };
          }
        })
        .filter(Boolean);

      const items = similarImages.slice(0, topN);

      if (items.length > 0) {
        const result = await Promise.all(
          items.map((item) => {
            return this.dataService.product.getAllByProperties({
              imageName: item.imageName,
            });
          }),
        );
        return {
          data: result.flat(),
          message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS,
        };
      }
      return {
        data: [],
        message: MESSAGES.RECOMMENDATIONS.GET.SUCCESS,
      };
    } catch (error) {
      console.error('Error finding similar images:', error);
      throw new Error('Failed to find similar images');
    }
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as faiss from 'faiss-node';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class FaissService implements OnModuleInit {
  private faissIndex: faiss.IndexFlatL2;
  private imageData: { imageName: string; clusterId: number }[] = [];
  private embeddingMatrix: number[][] = [];

  constructor(
    @InjectRepository(ImageClusterModel)
    private readonly imageClusterRepository: Repository<ImageClusterModel>,
    @InjectRepository(ImageClustersMVModel)
    private readonly imageClusterMVRepository: Repository<ImageClustersMVModel>,

    private readonly cacheService: CacheService,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'test') {
      await this.initializeFaissIndex();
    }
  }

  private async initializeFaissIndex(): Promise<void> {
    try {
      const cacheKey = `image_clusters`;

      let imageClusterEntities: ImageClustersMVModel[] = [];
      const cachedData =
        await this.cacheService.getFromCache<ImageClustersMVModel[]>(cacheKey);
      if (cachedData) {
        imageClusterEntities = cachedData;
      } else {
        imageClusterEntities = await this.imageClusterMVRepository.find();
      }

      if (!imageClusterEntities.length) {
        throw new Error('No data found in image_clusters table');
      }

      const embeddings: number[][] = [];
      imageClusterEntities.forEach(
        ({ clipEmbedding, imageName, clusterId }) => {
          if (clipEmbedding.length) {
            embeddings.push(clipEmbedding);
            this.imageData.push({ imageName, clusterId });
          }
        },
      );

      if (!embeddings.length) {
        throw new Error('No valid embeddings found for FAISS index');
      }

      const dimension = embeddings[0].length;
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      embeddings.forEach((embedding) => this.faissIndex.add(embedding));
      this.embeddingMatrix = embeddings;

      await this.cacheService.setToCache<ImageClustersMVModel[]>(
        cacheKey,
        imageClusterEntities,
      );

      console.log(
        `FAISS index initialized with ${this.faissIndex.ntotal()} embeddings.`,
      );
    } catch (error) {
      console.error('Error initializing FAISS index:', error);
      throw new Error('Failed to initialize FAISS index');
    }
  }

  public findSimilarEmbeddings(targetEmbedding: number[], topN: number) {
    const results = this.faissIndex.search(targetEmbedding, topN);
    return results;
  }

  public getImageData(): { imageName: string; clusterId: number }[] {
    return this.imageData;
  }

  public getEmbeddingMatrix(): number[][] {
    return this.embeddingMatrix;
  }
}

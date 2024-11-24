import { Injectable, OnModuleInit } from '@nestjs/common';
import * as faiss from 'faiss-node';
import { ImageClusterModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters.model';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { CacheService } from '../cache/cache.service';
import { camelCase } from 'lodash';

@Injectable()
export class FaissService implements OnModuleInit {
  private faissIndex: faiss.IndexFlatL2;
  private imageData: { imageName: string; clusterId: number }[] = [];
  private embeddingMatrix: number[][] = [];
  private isInitialized = false;

  constructor(
    @InjectRepository(ImageClusterModel)
    private readonly imageClusterRepository: Repository<ImageClusterModel>,
    @InjectRepository(ImageClustersMVModel)
    private readonly imageClusterMVRepository: Repository<ImageClustersMVModel>,
    private readonly dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  async onModuleInit() {
    if (!this.isInitialized) {
      if (process.env.NODE_ENV !== 'test') {
        await this.initializeFaissIndex();
      }
      this.isInitialized = true;
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
        // Fetch data in chunks using raw SQL and camel case conversion
        imageClusterEntities = await this.fetchInChunks(10000);
      }

      if (!imageClusterEntities.length) {
        throw new Error('No data found in image_clusters table');
      }

      const embeddings: number[][] = [];
      const dimension = imageClusterEntities[0].clipEmbedding.length;

      this.faissIndex = new faiss.IndexFlatL2(dimension);

      for (const {
        clipEmbedding,
        imageName,
        clusterId,
      } of imageClusterEntities) {
        if (clipEmbedding.length) {
          embeddings.push(clipEmbedding);
          this.faissIndex.add(clipEmbedding);
          this.imageData.push({ imageName, clusterId });
        }
      }

      if (!embeddings.length) {
        throw new Error('No valid embeddings found for FAISS index');
      }

      this.embeddingMatrix = embeddings;

      // Cache the processed data for future use
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

  private async fetchInChunks(
    chunkSize: number,
  ): Promise<ImageClustersMVModel[]> {
    let offset = 0;
    const imageClusterEntities: ImageClustersMVModel[] = [];

    while (true) {
      const rawData = await this.imageClusterRepository.query(`
        SELECT clip_embedding, image_name, cluster_id
        FROM image_clusters_mv
        OFFSET ${offset} LIMIT ${chunkSize};
      `);

      if (rawData.length === 0) break;

      const convertedData =
        this.convertKeysToCamelCase<ImageClustersMVModel>(rawData);
      imageClusterEntities.push(...convertedData);
      offset += chunkSize;
    }

    return imageClusterEntities;
  }

  private convertKeysToCamelCase<T>(rows: T[]): T[] {
    return rows.map((row) => {
      const camelCasedRow = {};
      for (const key in row) {
        camelCasedRow[camelCase(key)] = row[key];
      }
      return camelCasedRow as T;
    });
  }
}

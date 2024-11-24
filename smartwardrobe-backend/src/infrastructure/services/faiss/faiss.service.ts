import { Injectable, OnModuleInit } from '@nestjs/common';
import * as faiss from 'faiss-node';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class FaissService implements OnModuleInit {
  private faissIndex: faiss.IndexFlatL2 | null = null;
  private imageData: { imageName: string; clusterId: number }[] = [];
  private embeddingMatrix: number[][] = [];
  private isInitialized = false;
  private isInitializing = false;
  private readonly BATCH_SIZE = 10000;
  private readonly INITIAL_BATCH_SIZE = 1000;

  constructor(
    @InjectRepository(ImageClustersMVModel)
    private readonly imageClusterMVRepository: Repository<ImageClustersMVModel>,
    private readonly cacheService: CacheService,
  ) {}

  async onModuleInit() {}

  private async initialize() {
    if (this.isInitialized) return;
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    try {
      this.isInitializing = true;
      console.log('Starting FAISS initialization...');

      const cacheKey = 'faiss_index_data';
      const cachedData = await this.cacheService.getFromCache<{
        imageData: typeof this.imageData;
        embeddingMatrix: typeof this.embeddingMatrix;
      }>(cacheKey);

      if (cachedData) {
        console.log('Found cached FAISS data, initializing from cache...');
        await this.initializeFromCache(cachedData);
      } else {
        console.log('No cached data found, loading from database...');
        // The dimension will be automatically determined from the first embedding
        await this.loadInitialBatch();
        this.isInitialized = true;

        // Load remaining data in background
        this.loadRemainingBatches();
      }
    } catch (error) {
      console.error('Error initializing FAISS:', error);
      this.isInitialized = false;
      throw new Error('Failed to initialize FAISS service');
    } finally {
      this.isInitializing = false;
    }
  }

  private async initializeFromCache(cachedData: {
    imageData: typeof this.imageData;
    embeddingMatrix: typeof this.embeddingMatrix;
  }) {
    this.imageData = cachedData.imageData;
    this.embeddingMatrix = cachedData.embeddingMatrix;

    // Create index with dimension from first embedding
    if (this.embeddingMatrix.length > 0) {
      const dimension = this.embeddingMatrix[0].length;
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      // Process cached embeddings in batches
      const totalEmbeddings = this.embeddingMatrix.length;
      for (let i = 0; i < totalEmbeddings; i += this.BATCH_SIZE) {
        const batchEnd = Math.min(i + this.BATCH_SIZE, totalEmbeddings);
        const batch = this.embeddingMatrix.slice(i, batchEnd);

        for (const embedding of batch) {
          this.faissIndex.add(embedding);
        }

        console.log(
          `Processed ${batchEnd}/${totalEmbeddings} cached embeddings`,
        );
      }

      this.isInitialized = true;
      console.log('FAISS initialization from cache complete');
    }
  }

  private async loadInitialBatch(): Promise<void> {
    console.log('Loading initial batch...');
    const initialData = await this.imageClusterMVRepository.query(`
      SELECT clip_embedding, image_name, cluster_id
      FROM image_clusters_mv
      LIMIT ${this.INITIAL_BATCH_SIZE};
    `);

    if (initialData.length > 0 && initialData[0].clip_embedding) {
      const dimension = initialData[0].clip_embedding.length;
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      for (const record of initialData) {
        if (record.clip_embedding?.length) {
          this.faissIndex.add(record.clip_embedding);
          this.imageData.push({
            imageName: record.image_name,
            clusterId: record.cluster_id,
          });
          this.embeddingMatrix.push(record.clip_embedding);
        }
      }
    }

    console.log(`Initial batch loaded with ${initialData.length} records`);
  }

  private async loadRemainingBatches() {
    try {
      let offset = this.INITIAL_BATCH_SIZE;
      let totalLoaded = this.INITIAL_BATCH_SIZE;

      while (true) {
        const batch = await this.imageClusterMVRepository.query(`
          SELECT clip_embedding, image_name, cluster_id
          FROM image_clusters_mv
          OFFSET ${offset}
          LIMIT ${this.BATCH_SIZE};
        `);

        if (batch.length === 0) break;

        for (const record of batch) {
          if (record.clip_embedding?.length) {
            this.faissIndex!.add(record.clip_embedding);
            this.imageData.push({
              imageName: record.image_name,
              clusterId: record.cluster_id,
            });
            this.embeddingMatrix.push(record.clip_embedding);
          }
        }

        totalLoaded += batch.length;
        offset += this.BATCH_SIZE;
        console.log(`Loaded ${totalLoaded} total records`);

        // Add delay between batches
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Cache the complete data
      await this.cacheService.setToCache('faiss_index_data', {
        imageData: this.imageData,
        embeddingMatrix: this.embeddingMatrix,
      });

      console.log('Background loading complete');
    } catch (error) {
      console.error('Error in background loading:', error);
    }
  }

  public async findSimilarEmbeddings(targetEmbedding: number[], topN: number) {
    await this.initialize();
    if (!this.faissIndex || this.faissIndex.ntotal() === 0) {
      throw new Error('FAISS index not properly initialized');
    }
    return this.faissIndex.search(targetEmbedding, topN);
  }

  public async getImageData(): Promise<
    { imageName: string; clusterId: number }[]
  > {
    await this.initialize();
    return this.imageData;
  }

  public async getEmbeddingMatrix(): Promise<number[][]> {
    await this.initialize();
    return this.embeddingMatrix;
  }

  public getStatus(): {
    isInitialized: boolean;
    isInitializing: boolean;
    totalEmbeddings: number;
    totalImages: number;
    isCached: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      isInitializing: this.isInitializing,
      totalEmbeddings: this.faissIndex ? this.faissIndex.ntotal() : 0,
      totalImages: this.imageData.length,
      isCached: this.imageData.length > 0 && this.embeddingMatrix.length > 0,
    };
  }
}

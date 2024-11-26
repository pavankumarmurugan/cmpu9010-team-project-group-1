import { Injectable, OnModuleInit } from '@nestjs/common';
import * as faiss from 'faiss-node';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { RedisCacheService } from '../redis/redis-cache.service';
import pako from 'pako';

@Injectable()
export class FaissService implements OnModuleInit {
  private faissIndex: faiss.IndexFlatL2 | null = null;
  private imageData: { imageName: string; clusterId: number }[] = [];
  private embeddingMatrix: number[][] = [];
  private isInitialized = false;
  private isInitializing = false; // Prevent concurrent initialization
  private readonly BATCH_SIZE = 1000;

  constructor(
    @InjectRepository(ImageClustersMVModel)
    private readonly imageClusterMVRepository: Repository<ImageClustersMVModel>,
    private readonly redisCacheService: RedisCacheService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    this.scheduleBackgroundInitialization();
  }

  /**
   * Schedules background initialization to ensure FAISS index is loaded after app startup.
   */
  private scheduleBackgroundInitialization() {
    // Avoid duplicate interval registration
    if (
      this.schedulerRegistry.getIntervals().includes('faiss-initialization')
    ) {
      console.log('Initialization interval already registered.');
      return;
    }

    const interval = setInterval(() => {
      if (!this.isInitialized) {
        this.initializeInBackground()
          .then(() => console.log('FAISS initialized in background'))
          .catch((error) =>
            console.error(
              'Error during FAISS background initialization:',
              error,
            ),
          );
      } else {
        clearInterval(interval);
        this.schedulerRegistry.deleteInterval('faiss-initialization');
      }
    }, 10000); // Run every 10 seconds until initialization is complete

    this.schedulerRegistry.addInterval('faiss-initialization', interval);
  }

  /**
   * Ensures FAISS index is initialized.
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.initializeInBackground();
  }

  private async initializeInBackground() {
    if (this.isInitialized || this.isInitializing) return;

    this.isInitializing = true;

    try {
      console.log('Starting FAISS background initialization...');
      const cacheKey = 'faiss_index_data';
      const cachedData = await this.redisCacheService.get<string>(cacheKey);
      if (cachedData) {
        const finalCachedData = JSON.parse(this.decompressData(cachedData));
        await this.initializeFromCache(finalCachedData);
      } else {
        await this.loadInitialBatch();
        await this.loadRemainingBatches();
        await this.storeDataByCluster(); // Store data in Redis by cluster ID
      }
    } catch (error) {
      console.error('Error during FAISS initialization:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  private async loadInitialBatch(): Promise<void> {
    const initialBatch = await this.imageClusterMVRepository.find({
      take: this.BATCH_SIZE,
    });

    if (initialBatch.length > 0) {
      const dimension = initialBatch[0].clipEmbedding.length;
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      initialBatch.forEach((record) => {
        if (record.clipEmbedding?.length) {
          this.faissIndex.add(record.clipEmbedding);
          this.imageData.push({
            imageName: record.imageName,
            clusterId: record.clusterId,
          });
          this.embeddingMatrix.push(record.clipEmbedding);
        }
      });

      console.log(`Loaded ${initialBatch.length} initial embeddings`);
    }
  }

  private async loadRemainingBatches(): Promise<void> {
    const totalRecords = await this.imageClusterMVRepository.count();
    let offset = this.BATCH_SIZE;

    console.log(`Total records to load: ${totalRecords}`);

    while (offset < totalRecords) {
      const batch = await this.imageClusterMVRepository.find({
        skip: offset,
        take: this.BATCH_SIZE,
      });

      if (batch.length === 0) {
        console.log('No more records to load.');
        break;
      }

      batch.forEach((record) => {
        if (record.clipEmbedding?.length) {
          this.faissIndex!.add(record.clipEmbedding);
          this.imageData.push({
            imageName: record.imageName,
            clusterId: record.clusterId,
          });
          this.embeddingMatrix.push(record.clipEmbedding);
        }
      });

      offset += batch.length;
      console.log(`Loaded ${offset} embeddings so far.`);
      await this.delay(2000); // Delay of 2 seconds between batches
    }

    this.isInitialized = true;
    const compressedData = this.compressData(
      JSON.stringify({
        imageData: this.imageData,
        embeddingMatrix: this.embeddingMatrix,
      }),
    );
    await this.redisCacheService.set('faiss_index_data', compressedData);
    console.log('All batches loaded.');
  }

  /**
   * Store data in Redis grouped by cluster ID.
   */
  private async storeDataByCluster(): Promise<void> {
    const clusterDataMap: Record<number, any[]> = {};

    // Group data by cluster ID
    this.imageData.forEach((record, index) => {
      const clusterId = record.clusterId;
      if (!clusterDataMap[clusterId]) {
        clusterDataMap[clusterId] = [];
      }
      clusterDataMap[clusterId].push({
        imageName: record.imageName,
        embedding: this.embeddingMatrix[index],
      });
    });

    // Save each cluster's data in Redis
    for (const [clusterId, clusterData] of Object.entries(clusterDataMap)) {
      const key = `cluster:${clusterId}`;
      const serializedData = JSON.stringify(clusterData);
      await this.redisCacheService.set(key, serializedData);
      console.log(`Cluster ${clusterId} data stored in Redis.`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async initializeFromCache(cachedData: {
    imageData: typeof this.imageData;
    embeddingMatrix: typeof this.embeddingMatrix;
  }): Promise<void> {
    this.imageData = cachedData.imageData;
    this.embeddingMatrix = cachedData.embeddingMatrix;

    const dimension = this.embeddingMatrix[0]?.length;
    if (!dimension) return;

    this.faissIndex = new faiss.IndexFlatL2(dimension);
    this.embeddingMatrix.forEach((embedding) =>
      this.faissIndex!.add(embedding),
    );

    this.isInitialized = true;
    console.log('FAISS initialized from cache');
  }

  ///this is

  public async findTargetEmbedding(imageName: string): Promise<{
    targetEmbedding: number[];
    imageData: { imageName: string; clusterId: number }[];
  } | null> {
    await this.initialize(); // Ensure FAISS is initialized

    const imageRecord = this.imageData.find(
      (img) => img.imageName === imageName,
    );
    if (!imageRecord) {
      console.warn(`Image ${imageName} not found in preloaded data.`);
      const loaded = await this.loadDynamicEmbedding(imageName);
      if (!loaded) {
        console.error(`Failed to load embedding for image: ${imageName}`);
        return null;
      }
      return this.findTargetEmbedding(imageName); // Retry after dynamic loading
    }

    const targetIdx = this.imageData.indexOf(imageRecord);
    if (targetIdx === -1 || !this.embeddingMatrix[targetIdx]) {
      console.warn(`Embedding not loaded for image: ${imageName}`);
      return null;
    }

    return {
      targetEmbedding: this.embeddingMatrix[targetIdx],
      imageData: this.imageData,
    };
  }

  private async loadDynamicEmbedding(imageName: string): Promise<boolean> {
    try {
      const batch = await this.imageClusterMVRepository.query(
        `
          SELECT clip_embedding, image_name, cluster_id
          FROM image_clusters_mv
          WHERE image_name = $1
          LIMIT 1;
        `,
        [imageName],
      );

      if (batch.length === 0) {
        console.warn(`No embedding found for image: ${imageName}`);
        return false;
      }

      const record = batch[0];
      if (record.clip_embedding?.length) {
        this.faissIndex!.add(record.clip_embedding);
        this.imageData.push({
          imageName: record.image_name,
          clusterId: record.cluster_id,
        });
        this.embeddingMatrix.push(record.clip_embedding);
        console.log(`Dynamically loaded embedding for image: ${imageName}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error dynamically loading embedding: ${error.message}`);
      return false;
    }
  }

  /**
   * Searches the FAISS index for the top N embeddings most similar to the given target embedding.
   * @param targetEmbedding The target embedding to search for.
   * @param topN The number of top similar embeddings to retrieve.
   * @returns An object containing the labels (indices) of similar embeddings and their distances.
   */
  public async findSimilarEmbeddings(
    targetEmbedding: number[],
    topN: number,
  ): Promise<{ labels: number[]; distances: number[] }> {
    if (!this.faissIndex || !this.isInitialized) {
      throw new Error('FAISS index is not initialized yet.');
    }

    try {
      const result = this.faissIndex.search(targetEmbedding, topN);
      if (!result) {
        throw new Error('FAISS search returned no results.');
      }

      const { labels, distances } = result;
      return { labels, distances };
    } catch (error) {
      console.error('Error during FAISS search:', error.message);
      throw new Error('Failed to perform FAISS search.');
    }
  }

  /**
   * Compress data using gzip.
   */
  private compressData(data: string): string {
    return Buffer.from(pako.gzip(data)).toString('base64');
  }

  /**
   * Decompress data using gzip.
   */
  private decompressData(compressed: string): string {
    return pako.ungzip(new Uint8Array(Buffer.from(compressed, 'base64')), {
      to: 'string',
    });
  }
}

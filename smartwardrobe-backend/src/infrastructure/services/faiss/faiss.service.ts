import { Injectable } from '@nestjs/common';
import * as faiss from 'faiss-node';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FaissService {
  private faissIndex: faiss.IndexFlatL2 | null = null;
  private imageData: { imageName: string; clusterId: number }[] = [];
  private embeddingMatrix: number[][] = [];
  private readonly BATCH_SIZE = 1000;
  private readonly DATA_DIR = 'data/faiss';
  private readonly METADATA_FILE = 'metadata.json';
  private readonly EMBEDDINGS_FILE = 'embeddings.bin';
  private readonly INDEX_FILE = 'faiss.index';

  constructor(
    @InjectRepository(ImageClustersMVModel)
    private readonly imageClusterMVRepository: Repository<ImageClustersMVModel>,
  ) {}

  async onModuleInit() {
    await this.ensureDataDirectory();
    const needsInitialization = await this.checkInitializationNeeded();

    if (needsInitialization) {
      await this.exportDataToFiles();
    }

    await this.loadFromFiles();
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.DATA_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating data directory:', error);
      throw error;
    }
  }

  private async checkInitializationNeeded(): Promise<boolean> {
    try {
      await fs.access(path.join(this.DATA_DIR, this.METADATA_FILE));
      await fs.access(path.join(this.DATA_DIR, this.EMBEDDINGS_FILE));
      await fs.access(path.join(this.DATA_DIR, this.INDEX_FILE));
      return false;
    } catch {
      return true;
    }
  }

  /**
   * Export data from database to files
   */
  private async exportDataToFiles(): Promise<void> {
    console.log('Starting data export to files...');

    const totalRecords = await this.imageClusterMVRepository.count();
    let offset = 0;
    let dimension: number | null = null;

    // Open file streams
    const embeddingsStream = await fs.open(
      path.join(this.DATA_DIR, this.EMBEDDINGS_FILE),
      'w',
    );

    const metadata: { imageName: string; clusterId: number }[] = [];

    try {
      while (offset < totalRecords) {
        const batch = await this.imageClusterMVRepository.find({
          skip: offset,
          take: this.BATCH_SIZE,
        });

        for (const record of batch) {
          if (record.clipEmbedding?.length) {
            // Initialize dimension if not set
            if (!dimension) {
              dimension = record.clipEmbedding.length;
              // Initialize FAISS index
              this.faissIndex = new faiss.IndexFlatL2(dimension);
            }

            // Write embedding to binary file
            const buffer = Buffer.from(
              new Float32Array(record.clipEmbedding).buffer,
            );
            await embeddingsStream.write(buffer);

            // Store metadata
            metadata.push({
              imageName: record.imageName,
              clusterId: record.clusterId,
            });

            // Add to FAISS index
            this.faissIndex.add(record.clipEmbedding);
          }
        }

        offset += batch.length;
        console.log(`Processed ${offset}/${totalRecords} records`);
      }

      // Save metadata
      await fs.writeFile(
        path.join(this.DATA_DIR, this.METADATA_FILE),
        JSON.stringify(metadata),
        'utf8',
      );

      // Save FAISS index
      if (this.faissIndex) {
        await this.faissIndex.write(path.join(this.DATA_DIR, this.INDEX_FILE));
      }

      console.log('Data export completed successfully');
    } catch (error) {
      console.error('Error during data export:', error);
      throw error;
    } finally {
      await embeddingsStream.close();
    }
  }

  // ... previous code remains the same ...

  /**
   * Load data from files
   */
  private async loadFromFiles(): Promise<void> {
    console.log('Loading data from files...');

    try {
      // Load metadata
      const metadataContent = await fs.readFile(
        path.join(this.DATA_DIR, this.METADATA_FILE),
        'utf8',
      );
      this.imageData = JSON.parse(metadataContent);

      // Load embeddings
      const embeddingsFile = await fs.open(
        path.join(this.DATA_DIR, this.EMBEDDINGS_FILE),
        'r',
      );
      const stats = await embeddingsFile.stat();
      const dimension = stats.size / (4 * this.imageData.length); // 4 bytes per float

      // Read embeddings in chunks
      const buffer = Buffer.alloc(stats.size);
      await embeddingsFile.read(buffer, 0, stats.size, 0);
      await embeddingsFile.close();

      // Convert buffer to float array
      const float32Array = new Float32Array(buffer.buffer);

      // Reconstruct embedding matrix
      this.embeddingMatrix = [];
      for (let i = 0; i < this.imageData.length; i++) {
        const embedding = Array.from(
          float32Array.slice(i * dimension, (i + 1) * dimension),
        );
        this.embeddingMatrix.push(embedding);
      }

      // Initialize and load FAISS index
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      // Add embeddings to the index
      for (const embedding of this.embeddingMatrix) {
        this.faissIndex.add(embedding);
      }

      console.log(`Loaded ${this.imageData.length} records from files`);
    } catch (error) {
      console.error('Error loading data from files:', error);
      throw error;
    }
  }

  // ... rest of the code remains the same ...

  /**
   * Find similar embeddings using the FAISS index
   */
  public async findSimilarEmbeddings(
    targetEmbedding: number[],
    topN: number,
  ): Promise<{ labels: number[]; distances: number[] }> {
    if (!this.faissIndex) {
      throw new Error('FAISS index has not been initialized.');
    }

    try {
      const result = this.faissIndex.search(targetEmbedding, topN);
      if (!result) {
        throw new Error('FAISS search returned no results.');
      }

      const { labels, distances } = result;
      return { labels, distances };
    } catch (error) {
      console.error('Error during FAISS search:', error);
      throw new Error('Failed to perform FAISS search.');
    }
  }

  /**
   * Find target embedding by image name
   */
  public async findTargetEmbedding(imageName: string): Promise<{
    targetEmbedding: number[];
    imageData: { imageName: string; clusterId: number }[];
  } | null> {
    const imageRecord = this.imageData.find(
      (img) => img.imageName === imageName,
    );

    if (!imageRecord) {
      console.warn(`Image ${imageName} not found in FAISS index.`);
      return null;
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
}

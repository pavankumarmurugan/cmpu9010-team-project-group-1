import { Injectable } from '@nestjs/common';
import * as faiss from 'faiss-node';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as AWS from 'aws-sdk';

@Injectable()
export class FaissService {
  private faissIndex: faiss.IndexFlatL2 | null = null;
  private imageData: { imageName: string; clusterId: number }[] = [];
  private embeddingMatrix: number[][] = [];
  private readonly BATCH_SIZE = 1000;
  private readonly TEMP_DIR = '/tmp/faiss';
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(ImageClustersMVModel)
    private readonly imageClusterMVRepository: Repository<ImageClustersMVModel>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  async onModuleInit() {
    await this.ensureTempDirectory();
    const needsInitialization = await this.checkS3Files();

    if (needsInitialization) {
      await this.exportDataToS3();
    } else {
      await this.downloadFromS3();
    }

    await this.loadFromFiles();
  }

  private async ensureTempDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.TEMP_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
      throw error;
    }
  }

  private async checkS3Files(): Promise<boolean> {
    try {
      await this.s3
        .headObject({
          Bucket: this.bucketName,
          Key: 'faiss/metadata.json',
        })
        .promise();

      return false; // Files exist, no need to initialize
    } catch {
      return true; // Files don't exist, need to initialize
    }
  }

  private async exportDataToS3(): Promise<void> {
    console.log('Starting data export to S3...');

    const totalRecords = await this.imageClusterMVRepository.count();
    let offset = 0;
    let dimension: number | null = null;

    try {
      // Initialize temporary files
      const embeddingsPath = path.join(this.TEMP_DIR, 'embeddings.bin');
      const embeddings = await fs.open(embeddingsPath, 'w');
      const metadata = [];

      while (offset < totalRecords) {
        const batch = await this.imageClusterMVRepository.find({
          skip: offset,
          take: this.BATCH_SIZE,
        });

        for (const record of batch) {
          if (record.clipEmbedding?.length) {
            if (!dimension) {
              dimension = record.clipEmbedding.length;
              this.faissIndex = new faiss.IndexFlatL2(dimension);
            }

            const buffer = Buffer.from(
              new Float32Array(record.clipEmbedding).buffer,
            );
            await embeddings.write(buffer);

            metadata.push({
              imageName: record.imageName,
              clusterId: record.clusterId,
            });

            this.faissIndex.add(record.clipEmbedding);
          }
        }

        offset += batch.length;
        console.log(`Processed ${offset}/${totalRecords} records`);
      }

      await embeddings.close();

      // Upload metadata to S3
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: 'faiss/metadata.json',
          Body: JSON.stringify({
            metadata,
            dimension,
            totalRecords: metadata.length,
          }),
          ContentType: 'application/json',
        })
        .promise();

      // Upload embeddings to S3
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: 'faiss/embeddings.bin',
          Body: await fs.readFile(embeddingsPath),
          ContentType: 'application/octet-stream',
        })
        .promise();

      console.log('Data export to S3 completed successfully');
    } catch (error) {
      console.error('Error during data export to S3:', error);
      throw error;
    }
  }

  private async downloadFromS3(): Promise<void> {
    console.log('Downloading files from S3...');

    try {
      // Download metadata
      const metadataResult = await this.s3
        .getObject({
          Bucket: this.bucketName,
          Key: 'faiss/metadata.json',
        })
        .promise();

      await fs.writeFile(
        path.join(this.TEMP_DIR, 'metadata.json'),
        metadataResult.Body as Buffer,
      );

      // Download embeddings
      const embeddingsResult = await this.s3
        .getObject({
          Bucket: this.bucketName,
          Key: 'faiss/embeddings.bin',
        })
        .promise();

      await fs.writeFile(
        path.join(this.TEMP_DIR, 'embeddings.bin'),
        embeddingsResult.Body as Buffer,
      );

      console.log('Files downloaded from S3 successfully');
    } catch (error) {
      console.error('Error downloading files from S3:', error);
      throw error;
    }
  }

  private async loadFromFiles(): Promise<void> {
    console.log('Loading data from files...');

    try {
      // Load metadata
      const metadataContent = await fs.readFile(
        path.join(this.TEMP_DIR, 'metadata.json'),
        'utf8',
      );
      const { metadata, dimension, totalRecords } = JSON.parse(metadataContent);
      this.imageData = metadata;

      // Load embeddings
      const embeddingsFile = await fs.open(
        path.join(this.TEMP_DIR, 'embeddings.bin'),
        'r',
      );
      const buffer = Buffer.alloc(totalRecords * dimension * 4); // 4 bytes per float
      await embeddingsFile.read(buffer, 0, buffer.length, 0);
      await embeddingsFile.close();

      // Initialize FAISS index
      this.faissIndex = new faiss.IndexFlatL2(dimension);

      // Convert buffer to embeddings and add to index
      const float32Array = new Float32Array(buffer.buffer);
      this.embeddingMatrix = [];

      for (let i = 0; i < totalRecords; i++) {
        const embedding = Array.from(
          float32Array.slice(i * dimension, (i + 1) * dimension),
        );
        this.embeddingMatrix.push(embedding);
        this.faissIndex.add(embedding);
      }

      console.log(`Loaded ${this.imageData.length} records from files`);

      // Cleanup temp files
      await fs.unlink(path.join(this.TEMP_DIR, 'metadata.json'));
      await fs.unlink(path.join(this.TEMP_DIR, 'embeddings.bin'));
    } catch (error) {
      console.error('Error loading data from files:', error);
      throw error;
    }
  }

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

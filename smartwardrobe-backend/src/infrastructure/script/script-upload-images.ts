import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { IDataServices } from 'src/core/abstracts';

export class ImageUploader {
  private s3: AWS.S3;
  private db: IDataServices;

  constructor(
    private accessKeyId: string,
    private secretAccessKey: string,
    private dbConfig: IDataServices,
  ) {
    AWS.config.update({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: 'us-east-1',
    });

    this.s3 = new AWS.S3();
    this.db = this.dbConfig;
  }

  async uploadImagesToS3(folderPath: string): Promise<void> {
    const files = fs.readdirSync(folderPath);
    const records = [];

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileContent = fs.readFileSync(filePath);

      const params = {
        Bucket: 'sw-uploads-img',
        Key: file,
        Body: fileContent,
      };

      try {
        await this.s3.upload(params).promise();
        console.log(`File uploaded successfully. ${file}`);
        records.push({ fileName: file });
      } catch (error) {
        console.error(`Error uploading file ${file}:`, error);
      }
    }
  }
}

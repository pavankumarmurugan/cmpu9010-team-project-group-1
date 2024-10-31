import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { MulterFile } from 'multer';
import * as crypto from 'crypto';

@Injectable()
export class UploadSearchPictureService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFile(file: MulterFile): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileHash = crypto.createHash('md5').update(file.buffer).digest('hex');
    const fileName = `search-picture/${fileHash}.${fileExtension}`;

    // Check if the file already exists in S3
    const headParams: AWS.S3.HeadObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const fileExists = await this.s3
      .headObject(headParams)
      .promise()
      .then(() => true)
      .catch((error) => {
        if (error.code === 'NotFound') {
          return false;
        }
        throw error; // rethrow other errors
      });

    if (fileExists) {
      // If the file exists, return its URL
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    }

    // If the file does not exist, proceed with the upload
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }
}

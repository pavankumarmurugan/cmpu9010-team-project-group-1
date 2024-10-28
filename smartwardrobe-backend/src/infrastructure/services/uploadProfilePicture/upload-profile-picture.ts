import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { File as MulterFile } from 'multer';

@Injectable()
export class UploadProfilePictureService {
  private s3: AWS.S3;
  private readonly bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
  }
  async uploadFile(file: MulterFile, userId: number): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `profile-pictures/${userId}-${uuid()}.${fileExtension}`;

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

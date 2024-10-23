import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { IDataServices } from 'src/core/abstracts';

export class UploadData {
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

  async processCSV(
    csvFilePath: string,
    imageFolderPath: string,
  ): Promise<void> {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        const articleId = row.article_id;
        const subdirectory = articleId.substring(0, 3);
        const imagePath = path.join(
          imageFolderPath,
          subdirectory,
          `${articleId}.jpg`,
        );

        if (fs.existsSync(imagePath)) {
          const imageUrl = await this.uploadFile(imagePath, `${articleId}.jpg`);
          await this.insertProduct(row, imageUrl);
        } else {
          console.error(`Image not found: ${imagePath}`);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  }

  private async uploadFile(filePath: string, s3Key: string): Promise<string> {
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: 'sw-uploads-img',
      Key: s3Key,
      Body: fileContent,
    };

    const data = await this.s3.upload(params).promise();
    return data.Location;
  }

  private async insertProduct(row: any, imageUrl: string): Promise<void> {
    await this.db.product.create({
      articleId: row.article_id,
      productCode: row.product_code,
      prodName: row.prod_name,
      productTypeNo: row.product_type_no,
      productTypeName: row.product_type_name,
      productGroupName: row.product_group_name,
      graphicalAppearanceNo: row.graphical_appearance_no,
      graphicalAppearanceName: row.graphical_appearance_name,
      colourGroupCode: row.colour_group_code,
      colourGroupName: row.colour_group_name,
      perceivedColourValueId: row.perceived_colour_value_id,
      perceivedColourValueName: row.perceived_colour_value_name,
      perceivedColourMasterId: row.perceived_colour_master_id,
      perceivedColourMasterName: row.perceived_colour_master_name,
      departmentNo: row.department_no,
      departmentName: row.department_name,
      indexCode: row.index_code,
      indexName: row.index_name,
      indexGroupNo: row.index_group_no,
      indexGroupName: row.index_group_name,
      sectionNo: row.section_no,
      sectionName: row.section_name,
      garmentGroupNo: row.garment_group_no,
      garmentGroupName: row.garment_group_name,
      detailDesc: row.detail_desc,
      sku: null,
      categoryId: null,
      inventoryId: null,
      price: null,
      discountId: null,
      imageUrl: imageUrl,
    });
  }
}

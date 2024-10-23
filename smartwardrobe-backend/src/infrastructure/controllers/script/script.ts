import { Controller, Get, Injectable } from '@nestjs/common';
import * as path from 'path';
import { IDataServices } from 'src/core/abstracts';
import { IResponse } from 'src/core/interface/response.interface';
import { UploadData } from 'src/infrastructure/script/script';
import { SearchProductUsecase } from 'src/use-cases/search/search.usecase';

@Controller('script')
@Injectable()
export class ScriptController {
  constructor(
    private usecase: SearchProductUsecase,
    private databaseService: IDataServices,
  ) {}

  @Get('')
  async searchProducts(): Promise<IResponse<null>> {
    const srcRoot = path.resolve(__dirname, '..', '..', '..', '..');
    const csvFilePath = path.join(srcRoot, 'csv', 'articles.csv');
    const imageFolderPath = path.join(srcRoot, 'images');

    const uploader = new UploadData(
      process.env.AWS_ACCESS_KEY_ID,
      process.env.AWS_SECRET_ACCESS_KEY,
      this.databaseService,
    );
    await uploader.processCSV(csvFilePath, imageFolderPath);

    return;
  }
}

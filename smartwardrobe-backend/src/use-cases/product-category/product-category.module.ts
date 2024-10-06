import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/infrastructure/services/data-services/data-service.module';
import { ProductCategoryUsecase } from './product-category.usecase';
import { ConvertorsModule } from 'src/core/convertors/convertors.module';

@Module({
  imports: [DataServicesModule, ConvertorsModule],
  providers: [ProductCategoryUsecase],
  exports: [ProductCategoryUsecase],
})
export class ProductCategoryUsecaseModule {}

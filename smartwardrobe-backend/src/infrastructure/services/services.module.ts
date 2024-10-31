import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchProductsService } from './search/search-products.service';
import { UploadProfilePictureService } from './uploadProfilePicture/upload-profile-picture';
import { FaissService } from './faiss/faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClusterModel } from '../frameworks/data-services/model/image-clusters.model';
import { DataServicesModule } from './data-services/data-service.module';
import { UploadSearchPictureService } from './uploadProfilePicture/upload-search-picture';
import { CacheService } from './cache/cache.service';

@Module({
  imports: [
    HttpModule,
    DataServicesModule,
    TypeOrmModule.forFeature([ImageClusterModel]),
  ],
  providers: [
    SearchProductsService,
    UploadProfilePictureService,
    FaissService,
    UploadSearchPictureService,
    CacheService,
  ],
  exports: [
    SearchProductsService,
    UploadProfilePictureService,
    FaissService,
    UploadSearchPictureService,
    CacheService,
  ],
})
export class ServicesModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchService } from './search/search';
import { UploadProfilePictureService } from './uploadProfilePicture/upload-profile-picture';
import { FaissService } from './faiss/faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClusterModel } from '../frameworks/data-services/model/image-clusters.model';
import { DataServicesModule } from './data-services/data-service.module';

@Module({
  imports: [
    HttpModule,
    DataServicesModule,
    TypeOrmModule.forFeature([ImageClusterModel]),
  ],
  providers: [SearchService, UploadProfilePictureService, FaissService],
  exports: [SearchService, UploadProfilePictureService, FaissService],
})
export class ServicesModule {}

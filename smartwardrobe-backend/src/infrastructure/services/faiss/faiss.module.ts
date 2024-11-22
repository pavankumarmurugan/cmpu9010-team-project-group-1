import { Global, Module } from '@nestjs/common';
import { FaissService } from './faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClusterModel } from '../../frameworks/data-services/model/image-clusters.model';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { DataServicesModule } from '../data-services/data-service.module';
import { ServicesModule } from '../services.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ImageClusterModel, ImageClustersMVModel]),
    ServicesModule,
  ],
  providers: [FaissService],
  exports: [FaissService],
})
export class FaissModule {}

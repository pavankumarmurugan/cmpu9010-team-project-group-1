import { Global, Module } from '@nestjs/common';
import { FaissService } from './faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClusterModel } from '../../frameworks/data-services/model/image-clusters.model';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ImageClusterModel])],
  providers: [FaissService],
  exports: [FaissService],
})
export class FaissModule {}

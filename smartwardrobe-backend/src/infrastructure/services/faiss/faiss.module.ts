import { Global, Module } from '@nestjs/common';
import { FaissService } from './faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { ServicesModule } from '../services.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ImageClustersMVModel]), ServicesModule],
  providers: [FaissService],
  exports: [FaissService],
})
export class FaissModule {}

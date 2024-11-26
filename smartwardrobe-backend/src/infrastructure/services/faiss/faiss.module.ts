import { Global, Module } from '@nestjs/common';
import { FaissService } from './faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClustersMVModel } from 'src/infrastructure/frameworks/data-services/model/image-clusters-mv.model';
import { ServicesModule } from '../services.module';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ImageClustersMVModel]),
    ServicesModule,
    ScheduleModule.forRoot(),
  ],
  providers: [FaissService],
  exports: [FaissService],
})
export class FaissModule {}

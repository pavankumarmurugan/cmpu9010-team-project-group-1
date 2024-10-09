import { Module } from '@nestjs/common';
import { SQLDataServiceModule } from 'src/infrastructure/frameworks/data-services/sql-data-services.module';

@Module({
  imports: [SQLDataServiceModule],
  exports: [SQLDataServiceModule],
})
export class DataServicesModule {}

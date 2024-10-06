import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLDataService } from './sql-data-services.service';
import { IDataServices } from 'src/core/abstracts';
import { UserModel } from './model/user.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/../**/*.model.js'],
      password: process.env.DATABASE_PASSWORD,
      logging: ['query', 'error'],
      // synchronize: true,
    }),
    TypeOrmModule.forFeature([UserModel]),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: SQLDataService,
    },
  ],
  exports: [IDataServices],
})
export class SQLDataServiceModule {}

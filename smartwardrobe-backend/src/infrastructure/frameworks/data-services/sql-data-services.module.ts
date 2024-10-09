import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLDataService } from './sql-data-services.service';
import { IDataServices } from 'src/core/abstracts';
import { UserModel } from './model/user.model';
import { ConfigModule } from '@nestjs/config';
import { ProductCategoryModel } from './model/product-category.model';
import { ProductInventoryModel } from './model/product-inventory.model';
import { ProductModel } from './model/product.model';

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
    }),
    TypeOrmModule.forFeature([
      UserModel,
      ProductCategoryModel,
      ProductInventoryModel,
      ProductModel,
    ]),
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

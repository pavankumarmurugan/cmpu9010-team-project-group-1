import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDataServices, IGenericRepository } from 'src/core/abstracts';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { UserModel } from './model/user.model';
import { Repository } from 'typeorm';
import { SQLGenericRepository } from './sql-generic-repository';
import { ProductCategoryModel } from './model/product-category.model';
import { ProductCategoryEntity } from 'src/core/entities/product-category/product-category.entity';

@Injectable()
export class SQLDataService implements IDataServices, OnApplicationBootstrap {
  users: IGenericRepository<UserEntity>;
  productCategory: IGenericRepository<ProductCategoryEntity>;

  constructor(
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductCategoryModel)
    private productCategoryRepository: Repository<ProductCategoryEntity>,
  ) {}

  onApplicationBootstrap() {
    this.users = new SQLGenericRepository<UserModel>(this.usersRepository);
    this.productCategory = new SQLGenericRepository<ProductCategoryModel>(
      this.productCategoryRepository,
    );
  }
}

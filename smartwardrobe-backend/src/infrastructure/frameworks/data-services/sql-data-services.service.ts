import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDataServices, IGenericRepository } from 'src/core/abstracts';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { UserModel } from './model/user.model';
import { Repository } from 'typeorm';
import { SQLGenericRepository } from './sql-generic-repository';
import { ProductCategoryModel } from './model/product-category.model';
import { ProductCategoryEntity } from 'src/core/entities/product-category/product-category.entity';
import { ProductInventoryEntity } from 'src/core/entities/product-inventory/product-inventory.entity';
import { ProductInventoryModel } from './model/product-inventory.model';
import { ProductModel } from './model/product.model';
import { ProductEntity } from 'src/core/entities/product/product.entity';
import { CartItemModel } from './model/cart-items.model';
import { CartItemEntity } from 'src/core/entities/cart-item/cart-item.entity';

@Injectable()
export class SQLDataService implements IDataServices, OnApplicationBootstrap {
  users: IGenericRepository<UserEntity>;
  productCategory: IGenericRepository<ProductCategoryEntity>;
  productInventory: IGenericRepository<ProductInventoryEntity>;
  product: IGenericRepository<ProductEntity>;
  cartItem: IGenericRepository<CartItemEntity>;

  constructor(
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductCategoryModel)
    private productCategoryRepository: Repository<ProductCategoryEntity>,
    @InjectRepository(ProductInventoryModel)
    private productInventoryRepository: Repository<ProductInventoryEntity>,
    @InjectRepository(ProductModel)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CartItemModel)
    private cartItemRepository: Repository<CartItemEntity>,
  ) {}

  onApplicationBootstrap() {
    this.users = new SQLGenericRepository<UserModel>(this.usersRepository);
    this.productCategory = new SQLGenericRepository<ProductCategoryModel>(
      this.productCategoryRepository,
    );
    this.productInventory = new SQLGenericRepository<ProductInventoryModel>(
      this.productInventoryRepository,
    );
    this.product = new SQLGenericRepository<ProductModel>(
      this.productRepository,
    );
    this.cartItem = new SQLGenericRepository<CartItemEntity>(
      this.cartItemRepository,
    );
  }
}

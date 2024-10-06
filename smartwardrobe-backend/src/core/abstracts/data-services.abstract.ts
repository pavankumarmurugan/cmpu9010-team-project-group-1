import { ProductCategoryEntity } from '../entities/product-category/product-category.entity';
import { UserEntity } from '../entities/user/user.entity';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract users: IGenericRepository<UserEntity>;
  abstract productCategory: IGenericRepository<ProductCategoryEntity>;
}

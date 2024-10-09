import { ProductCategoryEntity } from '../entities/product-category/product-category.entity';
import { ProductInventoryEntity } from '../entities/product-inventory/product-inventory.entity';
import { ProductEntity } from '../entities/product/product.entity';
import { UserEntity } from '../entities/user/user.entity';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract users: IGenericRepository<UserEntity>;
  abstract productCategory: IGenericRepository<ProductCategoryEntity>;
  abstract productInventory: IGenericRepository<ProductInventoryEntity>;
  abstract product: IGenericRepository<ProductEntity>;
}

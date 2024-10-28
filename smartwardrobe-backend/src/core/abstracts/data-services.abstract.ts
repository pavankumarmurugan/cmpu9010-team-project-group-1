import { CartItemEntity } from '../entities/cart-item/cart-item.entity';
import { CartEntity } from '../entities/cart/cart.entity';
import { ChatEntity } from '../entities/chat/chat.entity';
import { LikesEntity } from '../entities/likes/likes.entity';
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
  abstract cartItem: IGenericRepository<CartItemEntity>;
  abstract cart: IGenericRepository<CartEntity>;
  abstract likes: IGenericRepository<LikesEntity>;
  abstract chat: IGenericRepository<ChatEntity>;
}

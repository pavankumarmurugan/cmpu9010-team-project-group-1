import { CartItemEntity } from '../entities/cart-item/cart-item.entity';
import { CartEntity } from '../entities/cart/cart.entity';
import { ChatEntity } from '../entities/chat/chat.entity';
import { FriendRequestsEntity } from '../entities/friend-request/friend-requests.entity';
import { FriendsEntity } from '../entities/friends/friends';
import { GroupMembersEntity } from '../entities/group-members/group-members.entity';
import { GroupEntity } from '../entities/group/group';
import { ImageClusterEntity } from '../entities/image-cluster/image-cluster.entity';
import { LikesEntity } from '../entities/likes/likes.entity';
import { ProductCategoryEntity } from '../entities/product-category/product-category.entity';
import { ProductInventoryEntity } from '../entities/product-inventory/product-inventory.entity';
import { ProductEntity } from '../entities/product/product.entity';
import { UserLikedModelsEntity } from '../entities/user-liked-model/user-liked-model.entity';
import { UserEntity } from '../entities/user/user.entity';
import { VtoImageSearchEntity } from '../entities/vto/vto.entity';
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
  abstract imageCluster: IGenericRepository<ImageClusterEntity>;
  abstract friendRequests: IGenericRepository<FriendRequestsEntity>;
  abstract friends: IGenericRepository<FriendsEntity>;
  abstract group: IGenericRepository<GroupEntity>;
  abstract groupMembers: IGenericRepository<GroupMembersEntity>;
  abstract vtoImageSearch: IGenericRepository<VtoImageSearchEntity>;
  abstract userLikedModel: IGenericRepository<UserLikedModelsEntity>;
}

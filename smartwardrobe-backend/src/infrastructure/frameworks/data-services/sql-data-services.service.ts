import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDataServices, IGenericRepository } from 'src/core/abstracts';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { UserModel } from './model/user.model';
import { In, Repository } from 'typeorm';
import { SQLGenericRepository } from './sql-generic-repository';
import { ProductCategoryModel } from './model/product-category.model';
import { ProductCategoryEntity } from 'src/core/entities/product-category/product-category.entity';
import { ProductInventoryEntity } from 'src/core/entities/product-inventory/product-inventory.entity';
import { ProductInventoryModel } from './model/product-inventory.model';
import { ProductModel } from './model/product.model';
import { ProductEntity } from 'src/core/entities/product/product.entity';
import { CartItemModel } from './model/cart-items.model';
import { CartItemEntity } from 'src/core/entities/cart-item/cart-item.entity';
import { CartEntity } from 'src/core/entities/cart/cart.entity';
import { CartModel } from './model/cart.model';
import { LikesEntity } from 'src/core/entities/likes/likes.entity';
import { LikesModel } from './model/likes.model';
import { ChatEntity } from 'src/core/entities/chat/chat.entity';
import { ChatModel } from './model/chat.model';
import { ImageClusterEntity } from 'src/core/entities/image-cluster/image-cluster.entity';
import { ImageClusterModel } from './model/image-clusters.model';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';
import { FriendsRequestsModel } from './model/friend-request.model';
import { FriendsEntity } from 'src/core/entities/friends/friends';
import { FriendsModel } from './model/friends.model';
import { GroupEntity } from 'src/core/entities/group/group';
import { GroupModel } from './model/group.model';
import { GroupMembersEntity } from 'src/core/entities/group-members/group-members.entity';
import { GroupMembersModel } from './model/group-members.model';
import { VtoImageSearchEntity } from 'src/core/entities/vto/vto.entity';
import { VtoImageSearchModel } from './model/vto.model';
import { UserLikedModelsEntity } from 'src/core/entities/user-liked-model/user-liked-model.entity';
import { UserLikedModels } from './model/user-liked-models';
import { ProductSubcategoryEntity } from 'src/core/entities/product-subcategory/product-subcategory.entity';
import { ProductSubcategoryModel } from './model/product-subcategory.model';
import { ImageClusterMVEntity } from 'src/core/entities/image-cluster-mv/image-cluster-mv.entity';
import { ImageClustersMVModel } from './model/image-clusters-mv.model';

@Injectable()
export class SQLDataService implements IDataServices, OnApplicationBootstrap {
  users: IGenericRepository<UserEntity>;
  productCategory: IGenericRepository<ProductCategoryEntity>;
  productInventory: IGenericRepository<ProductInventoryEntity>;
  product: IGenericRepository<ProductEntity>;
  cartItem: IGenericRepository<CartItemEntity>;
  cart: IGenericRepository<CartEntity>;
  likes: IGenericRepository<LikesEntity>;
  chat: IGenericRepository<ChatEntity>;
  imageCluster: IGenericRepository<ImageClusterEntity>;
  friendRequests: IGenericRepository<FriendRequestsEntity>;
  friends: IGenericRepository<FriendsEntity>;
  group: IGenericRepository<GroupEntity>;
  groupMembers: IGenericRepository<GroupMembersEntity>;
  vtoImageSearch: IGenericRepository<VtoImageSearchEntity>;
  userLikedModel: IGenericRepository<UserLikedModelsEntity>;
  productSubcategory: IGenericRepository<ProductSubcategoryEntity>;
  imageClusterMV: IGenericRepository<ImageClusterMVEntity>;

  constructor(
    @InjectRepository(UserModel)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(ProductCategoryModel)
    private productCategoryRepository: Repository<ProductCategoryEntity>,
    @InjectRepository(ProductInventoryModel)
    private productInventoryRepository: Repository<ProductInventoryEntity>,
    @InjectRepository(ProductModel)
    private productRepository: Repository<ProductModel>,
    @InjectRepository(CartItemModel)
    private cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(CartModel)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(LikesModel)
    private likesRepository: Repository<LikesEntity>,
    @InjectRepository(ChatModel)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(ImageClusterModel)
    private imageClusterRepository: Repository<ImageClusterEntity>,
    @InjectRepository(FriendsRequestsModel)
    private friendRequestsRepository: Repository<FriendRequestsEntity>,
    @InjectRepository(FriendsModel)
    private friendsRepository: Repository<FriendsEntity>,
    @InjectRepository(GroupModel)
    private groupRepository: Repository<GroupEntity>,
    @InjectRepository(GroupMembersModel)
    private groupMembersRepository: Repository<GroupMembersEntity>,
    @InjectRepository(VtoImageSearchModel)
    private vtoImageSearchRepository: Repository<VtoImageSearchEntity>,
    @InjectRepository(UserLikedModels)
    private userLikedModelRepository: Repository<UserLikedModelsEntity>,
    @InjectRepository(ProductSubcategoryModel)
    private productSubcategoryRepository: Repository<ProductSubcategoryEntity>,
    @InjectRepository(ImageClustersMVModel)
    private imageClusterMVRepository: Repository<ImageClusterMVEntity>,
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
    this.cart = new SQLGenericRepository<CartEntity>(this.cartRepository);
    this.likes = new SQLGenericRepository<LikesEntity>(this.likesRepository);
    this.chat = new SQLGenericRepository<ChatEntity>(this.chatRepository);
    this.imageCluster = new SQLGenericRepository<ImageClusterEntity>(
      this.imageClusterRepository,
    );
    this.friendRequests = new SQLGenericRepository<FriendRequestsEntity>(
      this.friendRequestsRepository,
    );
    this.friends = new SQLGenericRepository<FriendsEntity>(
      this.friendsRepository,
    );
    this.group = new SQLGenericRepository<GroupEntity>(this.groupRepository);
    this.groupMembers = new SQLGenericRepository<GroupMembersEntity>(
      this.groupMembersRepository,
    );
    this.vtoImageSearch = new SQLGenericRepository<VtoImageSearchEntity>(
      this.vtoImageSearchRepository,
    );
    this.userLikedModel = new SQLGenericRepository<UserLikedModelsEntity>(
      this.userLikedModelRepository,
    );
    this.productSubcategory =
      new SQLGenericRepository<ProductSubcategoryEntity>(
        this.productSubcategoryRepository,
      );
    this.imageClusterMV = new SQLGenericRepository<ImageClusterMVEntity>(
      this.imageClusterMVRepository,
    );
  }
}

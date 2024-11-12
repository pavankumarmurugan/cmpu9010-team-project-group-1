import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLDataService } from './sql-data-services.service';
import { IDataServices } from 'src/core/abstracts';
import { UserModel } from './model/user.model';
import { ConfigModule } from '@nestjs/config';
import { ProductCategoryModel } from './model/product-category.model';
import { ProductInventoryModel } from './model/product-inventory.model';
import { ProductModel } from './model/product.model';
import { CartItemModel } from './model/cart-items.model';
import { CartModel } from './model/cart.model';
import { LikesModel } from './model/likes.model';
import { ChatModel } from './model/chat.model';
import { ImageClusterModel } from './model/image-clusters.model';
import { FriendsRequestsModel } from './model/friend-request.model';
import { FriendsModel } from './model/friends.model';
import { GroupModel } from './model/group.model';
import { GroupMembersModel } from './model/group-members.model';
import { VtoImageSearchModel } from './model/vto.model';
import { UserLikedModels } from './model/user-liked-models';
import { ProductSubcategoryModel } from './model/product-subcategory.model';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      entities: [
        UserModel,
        ProductCategoryModel,
        ProductInventoryModel,
        ProductModel,
        CartItemModel,
        CartModel,
        LikesModel,
        ChatModel,
        ImageClusterModel,
        FriendsRequestsModel,
        FriendsModel,
        GroupModel,
        GroupMembersModel,
        VtoImageSearchModel,
        UserLikedModels,
        ProductSubcategoryModel,
      ],
      password: process.env.DATABASE_PASSWORD,
      // logging: ['query', 'error'],
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    TypeOrmModule.forFeature([
      UserModel,
      ProductCategoryModel,
      ProductInventoryModel,
      ProductModel,
      CartItemModel,
      CartModel,
      LikesModel,
      ChatModel,
      ImageClusterModel,
      FriendsRequestsModel,
      FriendsModel,
      GroupModel,
      GroupMembersModel,
      VtoImageSearchModel,
      UserLikedModels,
      ProductSubcategoryModel,
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

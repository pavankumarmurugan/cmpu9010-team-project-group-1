import { Module } from '@nestjs/common';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health-check/health.controller';
import { DataServicesModule } from '../services/data-services/data-service.module';
import { JWTModule } from '../frameworks/jwt/jwt.module';
import { BcryptModule } from '../frameworks/bcrypt/bcrypt.module';
import { ConvertorsModule } from '../../core/convertors/convertors.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductCategoryController } from './product-category/product-category.controller';
import { ProductInventoryController } from './product-inventory/product-inventory.controller';
import { UseCasesModule } from 'src/use-cases/use-cases.module';
import { ProductController } from './product/product.controller';
import { CartItemController } from './cart-item/cart-item.controller';
import { CartController } from './cart/cart.controller';
import { SearchSimilarProductsController } from './search/search-products.controller';
import { ServicesModule } from '../services/services.module';
// import { ScriptController } from './script/script';
import { LikesController } from './likes/likes.controller';
import { ChatController } from './chat/chat.controller';
import { ChatGateway } from './chat/chat-gateway.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RecommendationController } from './recommendation/recommendation.controller';
import { FriendRequestsController } from './friends/friendRequests.controller';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TerminusModule,
    // ThrottlerModule.forRoot({
    //   ttl: +process.env.THROTTLER_TTL,
    //   limit: +process.env.THROTTLER_LIMIT,
    // }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
    DataServicesModule,
    JWTModule,
    BcryptModule,
    ConvertorsModule,
    UseCasesModule,
    ServicesModule,
  ],
  controllers: [
    UserController,
    HealthController,
    AuthController,
    ProductController,
    ProductCategoryController,
    ProductInventoryController,
    CartItemController,
    CartController,
    SearchSimilarProductsController,
    // ScriptController,
    LikesController,
    ChatController,
    RecommendationController,
    FriendRequestsController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
    ChatGateway,
    JwtService,
  ],
})
export class ControllersModule {}

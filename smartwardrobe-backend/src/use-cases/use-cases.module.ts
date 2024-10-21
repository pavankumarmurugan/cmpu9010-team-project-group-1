import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductInventoryUsecase } from './product-inventory/product-inventory.usecase';
import { ConvertorsModule } from 'src/core/convertors/convertors.module';
import { DataServicesModule } from 'src/infrastructure/services/data-services/data-service.module';
import { ProductCategoryUsecase } from './product-category/product-category.usecase';
import { JWTModule } from 'src/infrastructure/frameworks/jwt/jwt.module';
import { BcryptModule } from 'src/infrastructure/frameworks/bcrypt/bcrypt.module';
import { UserUsecase } from './user/user.usecase';
import { LoginUsecase } from './auth/login.usecase';
import { LogoutUsecase } from './auth/logout.usecase';
import { RefreshTokenUsecase } from './auth/refresh-token.usecase';
import { ProductUsecase } from './product/product.usecase';
import { CartItemUsecase } from './cart-item/cart-item.usecase';
import { CartUsecase } from './cart/cart.usecase';
import { ServicesModule } from 'src/infrastructure/services/services.module';
import { SearchService } from 'src/infrastructure/services/search/search';
import { SearchProductUsecase } from './search/search.usecase';

@Module({
  imports: [
    HttpModule.register({}),

    DataServicesModule,
    ConvertorsModule,
    JWTModule,
    BcryptModule,
    ServicesModule,
  ],
  providers: [
    ProductInventoryUsecase,
    ProductCategoryUsecase,
    UserUsecase,
    LoginUsecase,
    LogoutUsecase,
    RefreshTokenUsecase,
    ProductUsecase,
    CartItemUsecase,
    CartUsecase,
    SearchService,
    SearchProductUsecase,
  ],
  exports: [
    ProductInventoryUsecase,
    ProductCategoryUsecase,
    UserUsecase,
    LoginUsecase,
    LogoutUsecase,
    RefreshTokenUsecase,
    ProductUsecase,
    CartItemUsecase,
    CartUsecase,
    SearchProductUsecase,
  ],
})
export class UseCasesModule {}

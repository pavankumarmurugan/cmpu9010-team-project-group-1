import { Module } from '@nestjs/common';
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

@Module({
  imports: [DataServicesModule, ConvertorsModule, JWTModule, BcryptModule],
  providers: [
    ProductInventoryUsecase,
    ProductCategoryUsecase,
    UserUsecase,
    LoginUsecase,
    LogoutUsecase,
    RefreshTokenUsecase,
    ProductUsecase,
  ],
  exports: [
    ProductInventoryUsecase,
    ProductCategoryUsecase,
    UserUsecase,
    LoginUsecase,
    LogoutUsecase,
    RefreshTokenUsecase,
    ProductUsecase,
  ],
})
export class UseCasesModule {}

import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TerminusModule,
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_TTL,
      limit: +process.env.THROTTLER_LIMIT,
    }),
    DataServicesModule,
    JWTModule,
    BcryptModule,
    ConvertorsModule,
    UseCasesModule,
  ],
  controllers: [
    UserController,
    HealthController,
    AuthController,
    ProductController,
    ProductCategoryController,
    ProductInventoryController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ControllersModule {}

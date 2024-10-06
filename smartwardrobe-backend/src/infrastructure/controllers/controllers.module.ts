import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health-check/health.controller';
import { DataServicesModule } from '../services/data-services/data-service.module';
import { JWTModule } from '../frameworks/jwt/jwt.module';
import { BcryptModule } from '../frameworks/bcrypt/bcrypt.module';
import { ConvertorsModule } from '../../core/convertors/convertors.module';
import { UserUsecaseModule } from '../../use-cases/user/user.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from 'src/use-cases/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductCategoryController } from './product-category/product-category.controller';
import { ProductCategoryUsecaseModule } from 'src/use-cases/product-category/product-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TerminusModule,
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_TTL,
      limit: +process.env.THROTTLER_LIMIT,
    }),
    UserUsecaseModule,
    ProductCategoryUsecaseModule,
    DataServicesModule,
    JWTModule,
    BcryptModule,
    ConvertorsModule,
    AuthModule,
  ],
  controllers: [
    UserController,
    HealthController,
    AuthController,
    ProductCategoryController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ControllersModule {}

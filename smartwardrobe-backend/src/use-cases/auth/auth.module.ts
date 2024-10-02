import { Module } from '@nestjs/common';
import { LoginUsecase } from './login.usecase';

import { LogoutUsecase } from './logout.usecase';
import { RefreshTokenUsecase } from './refresh-token.usecase';
import { ConvertorsModule } from 'src/core/convertors/convertors.module';
import { BcryptModule } from 'src/infrastructure/frameworks/bcrypt/bcrypt.module';
import { JWTModule } from 'src/infrastructure/frameworks/jwt/jwt.module';
import { DataServicesModule } from 'src/infrastructure/services/data-services/data-service.module';

@Module({
  imports: [JWTModule, DataServicesModule, ConvertorsModule, BcryptModule],
  exports: [LoginUsecase, LogoutUsecase, RefreshTokenUsecase],
  providers: [LoginUsecase, LogoutUsecase, RefreshTokenUsecase],
})
export class AuthModule {}

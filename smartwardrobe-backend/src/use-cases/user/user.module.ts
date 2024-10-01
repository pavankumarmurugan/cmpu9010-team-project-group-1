import { Module } from '@nestjs/common';
import { UserUsecase } from './user.usecase';
import { DataServicesModule } from 'src/infrastructure/services/data-services/data-service.module';
import { JWTModule } from 'src/infrastructure/frameworks/jwt/jwt.module';
import { ConvertorsModule } from 'src/core/convertors/convertors.module';
import { BcryptModule } from 'src/infrastructure/frameworks/bcrypt/bcrypt.module';

@Module({
  imports: [DataServicesModule, JWTModule, ConvertorsModule, BcryptModule],
  providers: [UserUsecase],
  exports: [UserUsecase],
})
export class UserUsecaseModule {}

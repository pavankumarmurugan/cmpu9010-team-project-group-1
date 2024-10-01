import { Module } from '@nestjs/common';
import { UserDtoConvertor } from './user/user-dto.convertor';
import { AuthDtoConvertor } from './auth/auth-dto.convertor';

@Module({
  providers: [UserDtoConvertor, AuthDtoConvertor],
  exports: [UserDtoConvertor, AuthDtoConvertor],
})
export class ConvertorsModule {}

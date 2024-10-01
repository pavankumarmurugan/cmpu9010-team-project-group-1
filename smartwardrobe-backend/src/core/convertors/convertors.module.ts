import { Module } from '@nestjs/common';
import { UserDtoConvertor } from './user/user-dto.convertor';

@Module({
  providers: [UserDtoConvertor],
  exports: [UserDtoConvertor],
})
export class ConvertorsModule {}

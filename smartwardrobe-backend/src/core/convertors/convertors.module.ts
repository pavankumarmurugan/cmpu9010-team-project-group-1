import { Module } from '@nestjs/common';
import { UserDtoConvertor } from './user/user-dto.convertor';
import { AuthDtoConvertor } from './auth/auth-dto.convertor';
import { ProductCategoryConvertor } from './product-category/product-category.convertor';

@Module({
  providers: [UserDtoConvertor, AuthDtoConvertor, ProductCategoryConvertor],
  exports: [UserDtoConvertor, AuthDtoConvertor, ProductCategoryConvertor],
})
export class ConvertorsModule {}

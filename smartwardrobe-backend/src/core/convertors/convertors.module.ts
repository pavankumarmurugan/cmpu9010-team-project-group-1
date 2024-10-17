import { Module } from '@nestjs/common';
import { UserDtoConvertor } from './user/user-dto.convertor';
import { AuthDtoConvertor } from './auth/auth-dto.convertor';
import { ProductCategoryConvertor } from './product-category/product-category.convertor';
import { ProductInventoryConvertor } from './product-inventory/product-inventory.convertor';
import { ProductConvertor } from './product/product.convertor';
import { CartItemConvertor } from './cart-item/cart-item.convertor';
import { CartConvertor } from './cart/cart.convertor';

@Module({
  providers: [
    UserDtoConvertor,
    AuthDtoConvertor,
    ProductCategoryConvertor,
    ProductInventoryConvertor,
    ProductConvertor,
    CartItemConvertor,
    CartConvertor,
  ],
  exports: [
    UserDtoConvertor,
    AuthDtoConvertor,
    ProductCategoryConvertor,
    ProductInventoryConvertor,
    ProductConvertor,
    CartItemConvertor,
    CartConvertor,
  ],
})
export class ConvertorsModule {}

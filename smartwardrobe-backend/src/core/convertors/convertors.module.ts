import { Module } from '@nestjs/common';
import { UserDtoConvertor } from './user/user-dto.convertor';
import { AuthDtoConvertor } from './auth/auth-dto.convertor';
import { ProductCategoryConvertor } from './product-category/product-category.convertor';
import { ProductInventoryConvertor } from './product-inventory/product-inventory.convertor';
import { ProductConvertor } from './product/product.convertor';
import { CartItemConvertor } from './cart-item/cart-item.convertor';
import { CartConvertor } from './cart/cart.convertor';
import { SearchImageSimilarProductsConvertor } from './search/search-image-similar-products.convertor';
import { LikesConvertor } from './likes/likes.convertor';
import { ChatConvertor } from './chat/chat.convertor';

@Module({
  providers: [
    UserDtoConvertor,
    AuthDtoConvertor,
    ProductCategoryConvertor,
    ProductInventoryConvertor,
    ProductConvertor,
    CartItemConvertor,
    CartConvertor,
    SearchImageSimilarProductsConvertor,
    LikesConvertor,
    ChatConvertor,
  ],
  exports: [
    UserDtoConvertor,
    AuthDtoConvertor,
    ProductCategoryConvertor,
    ProductInventoryConvertor,
    ProductConvertor,
    CartItemConvertor,
    CartConvertor,
    SearchImageSimilarProductsConvertor,
    LikesConvertor,
    ChatConvertor,
  ],
})
export class ConvertorsModule {}

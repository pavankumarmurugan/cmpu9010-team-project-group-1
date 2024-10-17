import { Injectable } from '@nestjs/common';
import { CartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-dto';
import { UpdateCartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-update-dto';
import { CartItemResDto } from 'src/core/dto/cart-item/cart-item-res-dto';
import { CartItemEntity } from 'src/core/entities/cart-item/cart-item.entity';
import { ProductEntity } from 'src/core/entities/product/product.entity';

@Injectable()
export class CartItemConvertor {
  toResDtoFromEntity(entity: CartItemEntity): CartItemResDto {
    return { ...entity };
  }

  toResDtoFromEntities(entity: CartItemEntity[]): CartItemResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toModelFromDto(cartId: number, dto: CartItemReqDto): CartItemEntity {
    return {
      ...dto,
      cartId,
    };
  }

  toUpdateModelFromDto(dto: UpdateCartItemReqDto): CartItemEntity {
    return {
      ...dto,
      id: undefined,
      updatedAt: new Date(),
      cartId: undefined,
    };
  }

  toResDtoFromEntitiesWithProductDetails(
    entity: CartItemEntity[],
    productEntity: ProductEntity[],
  ): CartItemResDto[] {
    return entity.map((item) => ({
      ...item,
      product: productEntity.find((product) => product.id === item.productId),
    }));
  }
}

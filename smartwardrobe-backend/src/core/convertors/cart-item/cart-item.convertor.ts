import { Injectable } from '@nestjs/common';
import { CartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-dto';
import { UpdateCartItemReqDto } from 'src/core/dto/cart-item/cart-item-req-update-dto';
import { CartItemResDto } from 'src/core/dto/cart-item/cart-item-res-dto';
import { CartItemEntity } from 'src/core/entities/cart-item/cart-item.entity';

@Injectable()
export class CartItemConvertor {
  toResDtoFromEntity(entity: CartItemEntity): CartItemResDto {
    return { ...entity };
  }

  toResDtoFromEntities(entity: CartItemEntity[]): CartItemResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toModelFromDto(dto: CartItemReqDto): CartItemEntity {
    return {
      ...dto,
    };
  }

  toUpdateModelFromDto(dto: UpdateCartItemReqDto): CartItemEntity {
    return {
      ...dto,
      id: undefined,
      updatedAt: new Date(),
    };
  }
}

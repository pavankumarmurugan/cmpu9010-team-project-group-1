import { Injectable } from '@nestjs/common';
import { CartReqDto } from 'src/core/dto/cart/cart-req-dto';
import { UpdateCartReqDto } from 'src/core/dto/cart/cart-req-update-dto';
import { CartResDto } from 'src/core/dto/cart/cart-res-dto';
import { CartEntity } from 'src/core/entities/cart/cart.entity';

@Injectable()
export class CartConvertor {
  toResDtoFromEntity(entity: CartEntity): CartResDto {
    return { ...entity };
  }

  toResDtoFromEntities(entity: CartEntity[]): CartResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toModelFromDto(dto: CartReqDto): CartEntity {
    return {
      ...dto,
    };
  }

  toUpdateModelFromDto(dto: UpdateCartReqDto): CartEntity {
    return {
      ...dto,
      id: undefined,
      updatedAt: new Date(),
    };
  }
}

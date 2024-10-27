import { Injectable } from '@nestjs/common';
import { LikesReqDto } from 'src/core/dto/likes/likes.req-dto';
import { UpdateLikesReqDto } from 'src/core/dto/likes/likes.req-update-dto';
import { LikesResDto } from 'src/core/dto/likes/likes.res-dto';
import { LikesEntity } from 'src/core/entities/likes/likes.entity';
import { ProductEntity } from 'src/core/entities/product/product.entity';

@Injectable()
export class LikesConvertor {
  toLikesResDtoFromEntity(entity: LikesEntity): LikesResDto {
    return { ...entity };
  }

  toLikesResDtoFromEntities(entity: LikesEntity[]): LikesResDto[] {
    return entity.map((item) => ({ ...item }));
  }

  toLikesResDtoFromProductAndLikesEntities(
    products: ProductEntity[],
    entity: LikesEntity[],
  ): LikesResDto[] {
    return entity.map((item) => {
      const product = products.find((product) => product.id === item.productId);
      return {
        ...item,
        product,
      };
    });
  }

  toLikesModelFromDto(userId: number, dto: LikesReqDto): LikesEntity {
    return {
      ...dto,
      userId,
    };
  }

  toLikesProductModelFromDto(dto: UpdateLikesReqDto): LikesEntity {
    return {
      ...dto,
      id: undefined,
      updatedAt: new Date(),
    };
  }
}

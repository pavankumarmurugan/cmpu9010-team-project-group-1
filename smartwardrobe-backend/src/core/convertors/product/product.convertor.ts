import { Injectable } from '@nestjs/common';
import { ProductReqDto } from 'src/core/dto/product/product-req-dto';
import { ProductReqUpdateDto } from 'src/core/dto/product/product-req-update-dto';
import { ProductResDto } from 'src/core/dto/product/product-res-dto';
import { ProductEntity } from 'src/core/entities/product/product.entity';

@Injectable()
export class ProductConvertor {
  toProductResDtoFromEntity(data: ProductEntity): ProductResDto {
    return { ...data };
  }

  toProductResDtoFromEntities(data: ProductEntity[]): ProductResDto[] {
    return data.map((item) => ({ ...item }));
  }

  toProductModelFromDto(productReqDto: ProductReqDto): ProductEntity {
    return {
      ...productReqDto,
      // inventory: {
      //   quantity: 100,
      // },
    };
  }

  toUpdateProductModelFromDto(
    productReqUpdateDto: ProductReqUpdateDto,
  ): ProductEntity {
    return {
      ...productReqUpdateDto,
      id: undefined,
      updatedAt: new Date(),
    };
  }
}

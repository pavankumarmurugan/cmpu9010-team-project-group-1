import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsObject } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';
import { ProductResDto } from '../product/product-res-dto';

export class LikesResDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id?: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly productId?: number;

  @ApiProperty({ required: true })
  @IsObject()
  readonly product?: ProductResDto;

  @ApiProperty({
    required: true,
    example: 'M',
    description: 'Product size',
  })
  @IsEnum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
  readonly productSize: string;
}

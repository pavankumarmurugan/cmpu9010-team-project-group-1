import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class CartItemReqDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'The product id to be added to the cart',
  })
  @IsNumber()
  readonly productId: number;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'The quantity of the product to be added to the cart',
  })
  @IsNumber()
  readonly quantity: number;

  @ApiProperty({ required: true, default: 'M' })
  @IsString()
  @IsIn(['S', 'M', 'L', 'XL'])
  readonly size: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';
import { CartItemReqDto } from './cart-item-req-dto';

export class UpdateCartItemReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly quantity: number;

  @ApiProperty({ required: true, default: 'M' })
  @IsString()
  @IsIn(['S', 'M', 'L', 'XL'])
  readonly size: string;
}

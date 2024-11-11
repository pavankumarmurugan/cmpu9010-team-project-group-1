import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CartItemReqDto } from './cart-item-req-dto';

export class UpdateCartItemReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly quantity: number;
}

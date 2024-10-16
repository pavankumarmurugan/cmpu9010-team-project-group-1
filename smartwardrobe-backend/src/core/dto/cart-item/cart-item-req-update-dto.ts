import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CartItemReqDto } from './cart-item-req-dto';

export class UpdateCartItemReqDto extends CartItemReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CartReqDto } from './cart-req-dto';

export class UpdateCartReqDto extends CartReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;
}

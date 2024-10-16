import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CartItemReqDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly sessionId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly productId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly quantity: number;
}

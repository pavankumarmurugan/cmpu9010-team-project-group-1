import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ProductInventoryReqDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly quantity: number;
}

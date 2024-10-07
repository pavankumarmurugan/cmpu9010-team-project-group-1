import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ProductReqDto } from './product-req-dto';

export class ProductReqUpdateDto extends ProductReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;
}

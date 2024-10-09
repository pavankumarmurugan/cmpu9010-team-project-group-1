import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ProductCategoryReqDto } from './product-category-req-dto';

export class UpdateProductCategoryReqDto extends ProductCategoryReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;
}

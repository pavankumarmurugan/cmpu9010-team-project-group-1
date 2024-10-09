import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ProductInventoryReqDto } from './product-inventory-req-dto';

export class UpdateProductInventoryCategoryReqDto extends ProductInventoryReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;
}

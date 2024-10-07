import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class ProductResDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id?: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly desc: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly SKU: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly categoryId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly inventoryId?: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly discountId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly price: number;
}

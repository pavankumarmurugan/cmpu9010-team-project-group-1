import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductReqDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  readonly desc: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  readonly SKU: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsOptional()
  readonly categoryId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsOptional()
  readonly discountId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsOptional()
  readonly price: number;
}

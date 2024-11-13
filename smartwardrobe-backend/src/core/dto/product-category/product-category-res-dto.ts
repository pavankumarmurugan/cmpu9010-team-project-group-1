import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class ProductCategoryResDto extends BaseDto {
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
  @IsArray()
  readonly subCategories: string[];
}

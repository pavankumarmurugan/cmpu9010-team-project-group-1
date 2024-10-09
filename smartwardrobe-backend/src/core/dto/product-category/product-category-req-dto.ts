import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductCategoryReqDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  readonly desc: string;
}

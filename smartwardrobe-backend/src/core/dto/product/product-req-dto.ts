import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductReqDto {
  @ApiProperty()
  @IsString()
  readonly imageName?: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly type?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly pattern?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly color?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly colorShade?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly material?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly occasion?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly applicableSeason?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly trail?: boolean;
}

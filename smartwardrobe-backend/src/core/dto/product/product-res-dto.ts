import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class ProductResDto extends BaseDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @IsString()
  readonly imageName?: string;

  @ApiProperty()
  @IsString()
  readonly color?: string;

  @ApiProperty()
  @IsString()
  readonly type?: string;

  @ApiProperty()
  @IsString()
  readonly style?: string;

  @ApiProperty()
  @IsString()
  readonly material?: string;

  @ApiProperty()
  @IsString()
  readonly category?: string;

  @ApiProperty()
  @IsString()
  readonly occasion?: string;

  @ApiProperty()
  @IsString()
  readonly neckline?: string;

  @ApiProperty()
  @IsString()
  readonly fit?: string;

  @ApiProperty()
  @IsString()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  readonly imageUrl?: string;

  @ApiProperty()
  @IsNumber()
  readonly price?: number;
}

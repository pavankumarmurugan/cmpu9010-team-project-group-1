import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class SearchImageSimilarProductResDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsString()
  readonly image_name?: string;
}

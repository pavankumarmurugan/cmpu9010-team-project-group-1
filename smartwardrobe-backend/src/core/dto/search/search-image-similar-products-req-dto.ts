import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchImageSimilarProductReqDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly mime: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly data: number;
}

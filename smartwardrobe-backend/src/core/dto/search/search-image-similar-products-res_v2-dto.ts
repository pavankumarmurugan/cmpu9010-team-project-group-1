import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';
import { ProductResDto } from '../product/product-res-dto';
import { SearchTextQueryResults } from 'src/core/entities/text-ai/text-ai.entity';

export class SearchImageSimilarProductResDtoV2 extends BaseDto {
  @ApiProperty({ required: false })
  @IsArray()
  readonly products?: ProductResDto[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  readonly expectedQueries?: SearchTextQueryResults[];
}

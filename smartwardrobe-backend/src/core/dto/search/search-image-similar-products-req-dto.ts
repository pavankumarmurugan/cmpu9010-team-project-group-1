import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Multer } from 'multer';

export class SearchImageSimilarProductReqDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Image file to search similar products',
  })
  @IsOptional()
  file: Multer.File;

  @ApiProperty({
    required: false,
    example: "Women's navy blazer suitable for office wear",
  })
  @IsString()
  @IsOptional()
  readonly query: string;
}

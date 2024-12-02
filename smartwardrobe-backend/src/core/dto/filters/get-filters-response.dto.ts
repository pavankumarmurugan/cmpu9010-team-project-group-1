import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import {
  CATEGORY_SUBCATEGORY_MAP,
  VALID_COLORS,
  VALID_MATERIALS,
  VALID_OCCASIONS,
  VALID_PATTERNS,
} from './categories.map';

export class GetFiltersResponseDto {
  @ApiProperty({
    example: VALID_COLORS,
    description: 'List of colors',
  })
  @IsArray()
  colors: string[];

  @ApiProperty({
    example: VALID_MATERIALS,
    description: 'List of materials',
  })
  @IsArray()
  materials: string[];

  @ApiProperty({
    example: VALID_OCCASIONS,
    description: 'List of occasions',
  })
  @IsArray()
  occasions: string[];

  @ApiProperty({
    example: CATEGORY_SUBCATEGORY_MAP,
    description: 'List of categories',
  })
  @IsArray()
  categories: typeof CATEGORY_SUBCATEGORY_MAP;

  @ApiProperty({
    example: VALID_PATTERNS,
    description: 'List of patterns',
  })
  @IsArray()
  patterns: string[];
}

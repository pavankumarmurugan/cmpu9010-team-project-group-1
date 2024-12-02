import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class GetFiltersResponseDto {
  @ApiProperty({
    example: ['red', 'blue', 'green'],
    description: 'List of colors',
  })
  @IsArray()
  colors: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SearchHistoryResDTO {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  id?: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNumber()
  userId?: number;

  @ApiProperty({
    type: 'string',
    example: 'search query',
  })
  searchQuery?: string;

  @ApiProperty({
    type: 'Date',
    example: '2021-08-09',
  })
  createdAt?: Date;
}

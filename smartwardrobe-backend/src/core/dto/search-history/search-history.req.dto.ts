import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchHistoryReqDTO {
  @ApiProperty({
    type: 'string',
    example: 'search query',
    required: true,
  })
  @IsString()
  searchQuery?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LikesReqDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'Product ID to like',
  })
  @IsNumber()
  readonly productId: number;
}

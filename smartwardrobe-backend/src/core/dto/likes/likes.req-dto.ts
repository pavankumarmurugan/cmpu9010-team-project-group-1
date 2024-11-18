import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

export class LikesReqDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: 'Product ID to like',
  })
  @IsNumber()
  readonly productId: number;

  @ApiProperty({
    required: true,
    example: 'M',
    description: 'Product size',
  })
  @IsEnum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
  readonly productSize: string;
}

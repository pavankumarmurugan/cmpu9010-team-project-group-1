import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LikesReqDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly productId: number;
}

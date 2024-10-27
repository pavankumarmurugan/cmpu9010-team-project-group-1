import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { LikesReqDto } from './likes.req-dto';

export class UpdateLikesReqDto extends LikesReqDto {
  @ApiProperty({ required: false })
  @IsNumber()
  readonly id: number;
}

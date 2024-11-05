import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateFriendRequestsReqDto {
  @ApiProperty({ example: 1, description: 'The ID of the friend request' })
  @IsNumber()
  requestId?: number;
}

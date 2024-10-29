import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { FRIEND_REQUEST_STATUS } from 'src/infrastructure/common/enum.ts/friend-requests.enum';

export class UpdateFriendRequestsReqDto {
  @ApiProperty({ example: 1, description: 'The ID of the friend request' })
  @IsNumber()
  requestId?: number;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the friend request',
  })
  @IsString()
  @IsEnum(FRIEND_REQUEST_STATUS)
  status?: string;
}

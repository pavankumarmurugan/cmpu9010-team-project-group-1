import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';
import { UserResDTO } from '../user/user-res.dto';

export class FriendRequestsResDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'The ID of the friend request' })
  @IsNumber()
  requestId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the sender' })
  @IsNumber()
  senderId?: number;

  @ApiProperty({ example: 2, description: 'The ID of the receiver' })
  @IsNumber()
  receiverId?: number;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the friend request',
  })
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsObject()
  user?: UserResDTO;
}

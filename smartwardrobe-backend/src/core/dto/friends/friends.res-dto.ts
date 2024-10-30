import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class FriendsResDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'The ID of the friend relationship' })
  @IsNumber()
  friendId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the first user' })
  @IsNumber()
  user1Id?: number;

  @ApiProperty({ example: 2, description: 'The ID of the second user' })
  @IsNumber()
  user2Id?: number;
}

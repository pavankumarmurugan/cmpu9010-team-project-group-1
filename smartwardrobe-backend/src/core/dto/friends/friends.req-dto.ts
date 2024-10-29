import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FriendsReqDto {
  @ApiProperty({ example: 1, description: 'The ID of the first user' })
  @IsNumber()
  user1Id: number;

  @ApiProperty({ example: 2, description: 'The ID of the second user' })
  @IsNumber()
  user2Id: number;
}

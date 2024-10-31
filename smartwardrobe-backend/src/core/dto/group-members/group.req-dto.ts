import { IsNotEmpty, IsInt, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupMemberReqDto {
  @ApiProperty({ example: 1, description: 'The ID of the group' })
  @IsNotEmpty()
  @IsNumber()
  groupId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the user' })
  @IsNotEmpty()
  @IsNumber()
  userId?: number;
}

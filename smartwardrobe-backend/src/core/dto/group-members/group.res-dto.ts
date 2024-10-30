import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class GroupMemberResDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'The ID of the group' })
  @IsNumber()
  groupId?: number;

  @ApiProperty({ example: 1, description: 'The ID of the user' })
  @IsNumber()
  userId?: number;

  @ApiProperty({
    example: new Date(),
    description: 'The date the user joined the group',
  })
  joinedAt?: Date;
}

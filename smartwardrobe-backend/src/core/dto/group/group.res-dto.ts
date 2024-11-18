import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class GroupResDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'The ID of the group' })
  @IsNumber()
  groupId?: number;

  @ApiProperty({ example: 'Group 1', description: 'The name of the group' })
  groupName?: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the group',
  })
  @IsNumber()
  createdBy?: number;

  @ApiProperty({
    example: 1,
    description: 'The MembershipID of the user who is present the group',
  })
  membershipId?: number;
}

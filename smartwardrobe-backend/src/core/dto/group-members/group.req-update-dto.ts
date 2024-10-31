import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GroupMemberReqDto } from './group.req-dto';

export class UpdateGroupMembersDto extends GroupMemberReqDto {
  @ApiProperty({ example: '1', description: 'The ID of the membership' })
  @IsNotEmpty()
  @IsNumber()
  membershipId?: number;
}

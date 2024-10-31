import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupReqDto {
  @ApiProperty({ example: 'Group 1', description: 'The name of the group' })
  @IsNotEmpty()
  @IsString()
  groupName?: string;
}

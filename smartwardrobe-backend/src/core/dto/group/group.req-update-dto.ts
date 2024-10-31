import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GroupReqDto } from './group.req-dto';

export class UpdateGroupDto extends GroupReqDto {
  @ApiProperty({ example: '1', description: 'The ID of the group' })
  @IsNotEmpty()
  @IsNumber()
  groupId?: number;
}

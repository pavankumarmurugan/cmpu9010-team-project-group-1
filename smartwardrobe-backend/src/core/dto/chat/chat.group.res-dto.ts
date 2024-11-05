import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';
import { UserResDTO } from '../user/user-res.dto';

export class ChatGroupResDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat message' })
  @IsNumber()
  id?: number;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The message content',
  })
  @IsString()
  message?: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the group',
  })
  @IsNumber()
  groupId?: number;

  @ApiProperty({
    description: 'User details',
  })
  @IsObject()
  userDetails?: UserResDTO;
}

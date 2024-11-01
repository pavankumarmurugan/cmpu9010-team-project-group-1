import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class ChatReqDto {
  @ApiProperty({ example: 2, description: 'The ID of the receiver' })
  @IsNumber()
  receiverId?: number;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The message content',
  })
  @IsString()
  message?: string;

  @ApiProperty({
    example: 'text',
    description: 'The type of the message',
  })
  @IsString()
  @IsIn(['text', 'link_preview'], {
    message: "messageType must be either 'text' or 'linkPreview'",
  })
  messageType?: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the group',
  })
  @IsNumber()
  groupId?: number;
}

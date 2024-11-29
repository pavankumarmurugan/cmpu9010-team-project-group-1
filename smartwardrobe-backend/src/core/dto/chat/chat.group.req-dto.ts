import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Multer } from 'multer';

export class ChatGroupReqDto {
  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The message content',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    example: 'text',
    description:
      "The type of the message must be either 'text' or 'linkPreview' or 'audio'",
  })
  @IsString()
  @IsIn(['text', 'link_preview', 'audio'], {
    message: "messageType must be either 'text' or 'linkPreview' or 'audio'",
  })
  messageType?: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the group',
  })
  @IsNumber()
  @Type(() => Number)
  groupId?: number;

  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: false,
  })
  file?: Multer.File;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class ChatResDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat message' })
  @IsNumber()
  id?: number;

  @ApiProperty({ example: 1, description: 'The ID of the sender' })
  @IsNumber()
  senderId?: number;

  @ApiProperty({ example: 2, description: 'The ID of the receiver' })
  @IsNumber()
  receiverId?: number;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The message content',
  })
  @IsString()
  message?: string;
}

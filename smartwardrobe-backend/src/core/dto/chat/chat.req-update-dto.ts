import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateChatReqDto {
  @ApiProperty({ example: 1, description: 'The ID of the chat message' })
  @IsNumber()
  id?: number;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'The message content',
  })
  @IsString()
  message?: string;
}

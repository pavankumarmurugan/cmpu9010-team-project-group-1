import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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
}

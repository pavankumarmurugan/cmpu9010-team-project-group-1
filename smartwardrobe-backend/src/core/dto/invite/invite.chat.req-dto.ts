import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteChatReqDTO {
  @ApiProperty({
    example: 'smartwardrobe.store@gmail.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;
}

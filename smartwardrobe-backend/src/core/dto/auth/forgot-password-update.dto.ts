import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ForgotUpdatePasswordReqDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly password: string;

  @ApiProperty({
    required: true,
    description: 'Email of the user',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
    description: 'One Time Password',
    example: '123456',
  })
  @IsString()
  readonly otp: string;
}

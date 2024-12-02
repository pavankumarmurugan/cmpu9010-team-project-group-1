import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordReqDto {
  @ApiProperty({
    required: true,
    description: 'User email',
    example: 'test@gmail.com',
  })
  @IsString()
  readonly email: string;
}

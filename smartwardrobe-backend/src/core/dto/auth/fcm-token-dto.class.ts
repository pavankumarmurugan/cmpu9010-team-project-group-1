import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class FCMReqDto {
  @ApiProperty({
    required: true,
    description: 'Firebase Cloud Messaging token',
    example: 'fcm_token',
  })
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}

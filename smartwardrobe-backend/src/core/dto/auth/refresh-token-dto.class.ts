import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenResDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}

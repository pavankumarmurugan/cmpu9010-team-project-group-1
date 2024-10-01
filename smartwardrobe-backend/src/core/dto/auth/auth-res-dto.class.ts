import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthLoginResDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly role: string;
}

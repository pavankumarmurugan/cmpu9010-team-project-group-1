import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UserResDTO {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly userId: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly firstname?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly lastname: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly token?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly refreshToken?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly role?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly dob?: string;

  @ApiProperty({ required: false })
  @IsString()
  readonly profilePic?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly friendId?: number;

  @ApiProperty({ required: false })
  @IsString()
  readonly status?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  readonly membershipId?: number;
}

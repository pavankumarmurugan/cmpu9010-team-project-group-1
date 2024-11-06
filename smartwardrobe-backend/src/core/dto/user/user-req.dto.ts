import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';

export class UserReqDTO {
  @ApiProperty({ required: true, description: 'Username must be unique' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly username: string;

  @ApiProperty({ required: true, description: 'First name of the user' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly firstname: string;

  @ApiProperty({ required: true, description: 'Last name of the user' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly lastname: string;

  @ApiProperty({ required: true, description: 'Email of the user' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  readonly email?: string;

  @ApiProperty({ required: true, description: 'Date of birth of the user' })
  @IsString()
  @IsOptional()
  readonly dob?: string;

  @ApiProperty({ required: true, description: 'Password of the user' })
  @IsString()
  readonly password: string;

  @ApiProperty({
    required: true,
    description: 'Role can be user, admin',
    example: ROLES.USER,
    default: ROLES.USER,
  })
  @IsString()
  @IsEnum(ROLES)
  readonly role: string;
}

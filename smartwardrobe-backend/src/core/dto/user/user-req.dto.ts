import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';

export class UserReqDTO {
  @ApiProperty({ required: true, description: 'Username must be unique' })
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true, description: 'First name of the user' })
  @IsString()
  readonly firstname: string;

  @ApiProperty({ required: true, description: 'Last name of the user' })
  @IsString()
  readonly lastname: string;

  @ApiProperty({ required: true, description: 'Password of the user' })
  @IsString()
  readonly password: string;

  @ApiProperty({ required: true, description: 'Role can be user, admin' })
  @IsString()
  @IsEnum(ROLES)
  readonly role: string;
}

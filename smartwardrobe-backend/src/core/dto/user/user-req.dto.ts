import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ROLES } from 'src/infrastructure/common/enum.ts/roles.enum';

export class UserReqDTO {
  @ApiProperty({ required: true })
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly firstname: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly lastname: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsEnum(ROLES)
  readonly role: string;
}

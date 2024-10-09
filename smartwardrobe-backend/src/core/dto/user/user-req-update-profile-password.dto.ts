import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordUserReqDTO {
  @ApiProperty({ required: true })
  @IsString()
  // @IsStrongPassword()
  readonly password: string;
}

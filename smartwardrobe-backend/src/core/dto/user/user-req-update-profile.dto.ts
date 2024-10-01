import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileUserReqDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly firstname: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly lastname: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly dob: string;
}

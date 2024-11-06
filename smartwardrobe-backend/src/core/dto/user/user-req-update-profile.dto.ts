import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileUserReqDTO {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  readonly firstname: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  readonly lastname: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly dob: string;
}

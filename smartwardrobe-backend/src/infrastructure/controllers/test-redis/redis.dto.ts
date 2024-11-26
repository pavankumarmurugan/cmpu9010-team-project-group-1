import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class RedisDTO {
  @ApiProperty({ required: true, description: 'Username must be unique' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  key: string;

  @ApiProperty({ required: true, description: 'First name of the user' })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  value: string;
}

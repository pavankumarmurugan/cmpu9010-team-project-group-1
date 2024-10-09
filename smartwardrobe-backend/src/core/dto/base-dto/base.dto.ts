import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class BaseDto {
  @ApiProperty({ required: true })
  @IsDate()
  readonly createdAt?: Date;

  @ApiProperty({ required: true })
  @IsDate()
  readonly updatedAt?: Date;

  @ApiProperty({ required: true })
  @IsDate()
  readonly deletedAt?: Date;
}

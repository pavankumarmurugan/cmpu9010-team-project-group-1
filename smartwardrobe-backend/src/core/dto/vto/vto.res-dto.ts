import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';

export class VtoImageSearchResDto extends BaseDto {
  @ApiProperty({ required: false })
  @IsNumber()
  id?: number;

  @ApiProperty({ required: false })
  @IsString()
  modelImageName?: string;

  @ApiProperty({ required: false })
  @IsString()
  imageName?: string;

  @ApiProperty({ required: false })
  @IsString()
  vtoS3Url?: string;
}

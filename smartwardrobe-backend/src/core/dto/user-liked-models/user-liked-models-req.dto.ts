import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { BaseDto } from '../base-dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserLikedModelRequestDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '00279_00.jpg',
    description: 'Model image name',
  })
  modelImageName?: string;

  @ApiProperty({
    example:
      'https://sw-uploads-img.s3.eu-north-1.amazonaws.com/models/00279_00.jpg',
    description: 'Model image URL',
  })
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  modelImageUrl: string;
}

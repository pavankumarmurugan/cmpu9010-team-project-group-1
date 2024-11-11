import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '../base-dto/base.dto';
import { IsUrl, IsNotEmpty, IsString } from 'class-validator';

export class UserLikedModelResponseDTO extends BaseDto {
  @ApiProperty({ example: 1, description: 'ID' })
  id?: number;

  @ApiProperty({ example: 123, description: 'User ID' })
  userId?: number;

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
  modelImageUrl?: string;
}

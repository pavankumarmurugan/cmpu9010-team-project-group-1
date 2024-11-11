import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class VtoImageSearchReqDto {
  @ApiProperty({
    required: true,
    example: [
      '01066_00.jpg',
      '00035_00.jpg',
      '00071_00.jpg',
      '00135_00.jpg',
      '00373_00.jpg',
      '00814_00.jpg',
    ],
    description: 'The name of the model image',
  })
  @IsArray()
  modelImageName?: [string];

  @ApiProperty({
    required: true,
    example: '00006_00.jpg',
    description: 'The name of the image to search',
  })
  @IsString()
  imageName?: string;
}

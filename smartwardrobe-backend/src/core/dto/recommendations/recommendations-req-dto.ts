import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RecommendationsReqDto {
  @ApiProperty({
    description: 'Number of similar images to return',
    default: 5,
  })
  @IsNumber()
  topN: number;

  @ApiProperty({
    description: 'Name of the image to find similar images for',
    default: '00057_00.jpg',
  })
  @IsString()
  imageName: string;
}

import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteReqDTO {
  @ApiProperty({
    example: 'smartwardrobe.store@gmail.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 1,
    description: 'The id of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  productId?: number;
}
